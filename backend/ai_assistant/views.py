from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from appuser.permissions import IsLabAdminOrStudent
from .models import AIAnalysis, AIUsageLog
from .openai_service import analyze_overall_performance, analyze_course_performance, analyze_individual_plan
from .data_collector import collect_student_data, collect_course_data
from user_management.models import StudentIndividualPlan
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class AIAssistantView(APIView):
    """Main AI assistant endpoint"""
    
    permission_classes = [IsLabAdminOrStudent]
    
    def post(self, request):
        user = request.user
        analysis_type = request.data.get('type')  # 'overall', 'course', 'plan'
        
        # Check rate limit (max 10 requests per month)
        if not self.check_rate_limit(user.email):
            return Response(
                {"error": "Monthly AI analysis limit reached. Try again next month."},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        try:
            if analysis_type == 'overall':
                return self.get_overall_summary(user)
            elif analysis_type == 'course':
                course_id = request.data.get('course_id')
                if not course_id:
                    return Response(
                        {"error": "course_id required"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                return self.get_course_insights(user, course_id)
            elif analysis_type == 'plan':
                return self.analyze_plan(user)
            else:
                return Response(
                    {"error": "Invalid analysis type"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            logger.exception(f"Error in AI analysis for {user.email}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def check_rate_limit(self, email):
        """Check if user has exceeded monthly limit"""
        now = datetime.now()
        count = AIUsageLog.objects.filter(
            student_email=email,
            created_at__year=now.year,
            created_at__month=now.month
        ).count()

        return count < 10  # Max 10 per month
    
    def get_overall_summary(self, user):
        """Generate overall performance summary"""
        
        # Check for recent cached analysis (within last hour)
        recent_analysis = AIAnalysis.objects.filter(
            student_email=user.email,
            analysis_type='overall',
            created_at__gte=datetime.now() - timedelta(hours=1)
        ).first()
        
        if recent_analysis:
            return Response({
                'summary': recent_analysis.result,
                'cached': True
            })
        
        # Collect student data
        student_data = collect_student_data(user)
        
        # Call OpenAI
        result = analyze_overall_performance(student_data)
        
        # Save analysis
        AIAnalysis.objects.create(
            student_email=user.email,
            analysis_type='overall',
            result=result['summary']
        )
        
        # Log usage
        AIUsageLog.objects.create(
            student_email=user.email,
            analysis_type='overall',
            tokens_used=result['tokens_used']
        )
        
        return Response({
            'summary': result['summary'],
            'cached': False
        })
    
    def get_course_insights(self, user, course_id):
        """Generate course-specific insights"""
        
        # Collect data
        student_data = {'name': user.first_name or user.email.split('@')[0]}
        course_data = collect_course_data(user, course_id)
        
        # Call OpenAI
        result = analyze_course_performance(student_data, course_data)
        
        # Save analysis
        AIAnalysis.objects.create(
            student_email=user.email,
            analysis_type='course',
            course_id=course_id,
            result=result['summary']
        )
        
        # Log usage
        AIUsageLog.objects.create(
            student_email=user.email,
            analysis_type='course',
            tokens_used=result['tokens_used']
        )
        
        return Response({
            'summary': result['summary'],
            'course_name': course_data['name']
        })
    
    def analyze_plan(self, user):
        """Analyze individual plan"""
        
        # Check if plan exists
        plan = StudentIndividualPlan.objects.filter(
            student_email=user.email
        ).first()
        
        if not plan:
            return Response(
                {"error": "No individual plan found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Collect data
        student_data = collect_student_data(user)
        plan_data = {
            'summary': 'Individual plan document available',
            'uploaded_at': plan.uploaded_at
        }
        
        # Call OpenAI
        result = analyze_individual_plan(student_data, plan_data)
        
        # Save analysis
        AIAnalysis.objects.create(
            student_email=user.email,
            analysis_type='plan',
            result=result['summary']
        )
        
        # Log usage
        AIUsageLog.objects.create(
            student_email=user.email,
            analysis_type='plan',
            tokens_used=result['tokens_used']
        )
        
        return Response({
            'summary': result['summary']
        })