from openai import OpenAI
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

client = OpenAI(api_key=settings.OPENAI_API_KEY)


def analyze_overall_performance(student_data):
    """Generate overall performance summary"""
    
    courses_summary = ""
    for course in student_data.get('courses', []):
        courses_summary += f"""
        - {course['name']}:
          Open assignments: {course['open_assignments']}
          Graded assignments: {course['graded_count']}
          Average grade: {course.get('average_grade', 'N/A')}
        """
    
    prompt = f"""
You are an AI academic advisor for PhD students at a university.

Student Information:
- Name: {student_data['name']}
- Email: {student_data['email']}

Current Courses and Performance:
{courses_summary}

Individual Plan Status:
{student_data.get('plan_status', 'No individual plan uploaded yet')}

Please provide:
1. **Overall Assessment** (2-3 sentences about their current performance)
2. **Top 3 Priorities This Week** (specific, actionable items)
3. **Areas Needing Attention** (1-2 items that need improvement)
4. **Encouraging Message** (1 sentence of motivation)

Keep the response concise, actionable, and encouraging. Use a supportive, professional tone.
Format with clear headers and bullet points.
"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a supportive and knowledgeable PhD academic advisor. Provide concise, actionable advice. Always respond in Bulgarian language."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=600,
            temperature=0.7
        )
        
        result = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        
        logger.info(f"OpenAI analysis generated. Tokens used: {tokens_used}")
        
        return {
            'summary': result,
            'tokens_used': tokens_used
        }
        
    except Exception as e:
        logger.exception(f"Error calling OpenAI API: {e}")
        raise


def analyze_course_performance(student_data, course_data):
    """Generate course-specific insights"""
    
    prompt = f"""
You are an AI academic advisor for PhD students.

Student: {student_data['name']}
Course: {course_data['name']}

Course Status:
- Open assignments: {course_data['open_assignments']}
- Completed assignments: {course_data['graded_assignments']}
- Recent grades: {course_data.get('recent_grades', 'N/A')}
- Upcoming deadlines: {course_data.get('upcoming_deadlines', 'None')}

Provide:
1. **Course Performance** (brief assessment)
2. **Immediate Actions** (what to focus on this week)
3. **Study Tips** (specific to this course)

Be concise and actionable. Use bullet points.
"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a supportive PhD academic advisor specializing in course-specific guidance. Always respond in Bulgarian language."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )
        
        result = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        
        return {
            'summary': result,
            'tokens_used': tokens_used
        }
        
    except Exception as e:
        logger.exception(f"Error calling OpenAI API: {e}")
        raise


def analyze_individual_plan(student_data, plan_data):
    """Analyze individual plan progress"""
    
    prompt = f"""
You are an AI academic advisor for PhD students.

Student: {student_data['name']}

Individual Plan Summary:
{plan_data.get('summary', 'Plan document available but not yet analyzed')}

Current Academic Status:
- Active courses: {len(student_data.get('courses', []))}
- Overall performance: {student_data.get('overall_performance', 'Good')}

Provide:
1. **Plan Progress Assessment** (are they on track?)
2. **Alignment with Goals** (does current work match plan objectives?)
3. **Next Steps** (what milestones to focus on)

Be encouraging and specific.
"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a PhD academic advisor focused on long-term planning and milestone tracking. Always respond in Bulgarian language."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )
        
        result = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        
        return {
            'summary': result,
            'tokens_used': tokens_used
        }
        
    except Exception as e:
        logger.exception(f"Error calling OpenAI API: {e}")
        raise
    
    
    