import json
import google.auth.transport.requests
import google.oauth2.id_token
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from login.models import User, Trainer

GOOGLE_CLIENT_ID = '532738031986-q71s1r33kn8uek3msllhrog28s8bvt8d.apps.googleusercontent.com'

@csrf_exempt
def GoogleLoginView(request):
    if request.method == 'POST':
        try:

            body = json.loads(request.body)
            token = body.get('access_token')

            if not token:
                return JsonResponse({'error': 'Token not provided'}, status=400)

            request_obj = google.auth.transport.requests.Request()
            id_info = google.oauth2.id_token.verify_oauth2_token(token, request_obj, GOOGLE_CLIENT_ID)

            email = id_info.get('email')

            if not email:
                return JsonResponse({'error': 'Failed to extract email from token'}, status=400)

            try:
                user = User.objects.get(email=email)
                if user:
                    return JsonResponse({'message': 'Login successful', 'user_id': user.id, 'role': 'user'}, status=200)
                
                user = Trainer.objects.get(email=email)
                if user:
                    return JsonResponse({'message': 'Login successful', 'user_id': user.id, 'role': 'trainer'}, status=200)
            
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found. Please sign up first.'}, status=404)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)