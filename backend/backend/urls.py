"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import FileResponse, HttpResponse
from pathlib import Path

# Path to the React production build's index.html
_FRONTEND_INDEX = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist" / "index.html"


def spa_fallback(request, *args, **kwargs):
    """Serve the React SPA index.html for any browser navigation request.

    This lets React Router handle client-side routes like /news/1 after a
    hard reload or direct URL access, instead of Django returning a 404.
    Falls back to a plain 404 when the React build is not present (dev mode).
    """
    if _FRONTEND_INDEX.exists():
        return FileResponse(open(_FRONTEND_INDEX, "rb"), content_type="text/html")
    return HttpResponse(
        "<h3>React build not found.</h3>"
        "<p>Run <code>npm run build</code> inside <code>frontend/</code> "
        "or access the app via the Vite dev server (default: "
        "<a href='http://localhost:5173'>http://localhost:5173</a>).</p>",
        status=404,
        content_type="text/html",
    )


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('appuser.urls')),

    # Classroom Admin related endpoints
    path('api/classroom-admin/', include('classroom_admin.urls')),

    # Classroom Teacher related endpoints
    path('api/classroom-teacher/', include('classroom_teacher.urls')),

    # News and Events endpoints
    path('api/news/', include('news_and_events.urls')),

    # AI Assistant endpoints
    path('api/ai-assistant/', include('ai_assistant.urls')),

    # Classroom related endpoints
    path('api/classroom/', include('classroom.urls')),

    # User management endpoints (Google Group management)
    path('api/user-management/', include('user_management.urls')),

    # YouTube API endpoints
    path('api/youtube-live/', include('youtube_api.urls')),
    
    # Contact form endpoints
    path('api/contact/', include('contact_form.urls')),
    
    # Google OAuth2 authentication endpoints
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/', include('dj_rest_auth.registration.urls')),
    path('api/auth/', include('allauth.socialaccount.urls')),

    # SPA catch-all — must be last so all API routes take priority.
    # Serves the React build's index.html for browser navigation (hard reload,
    # direct URL access).  Returns a 404 hint in dev when the build is absent.
    re_path(r"^(?!admin/).*$", spa_fallback),
]


