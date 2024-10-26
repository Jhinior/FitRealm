from django.contrib import admin
from .models import Trainer, User

# # Register your models here.

# admin.site.register(User)
# admin.site.register(Trainer)
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Trainer, User

# Register your models here with customized admin options

# Registering the custom User model with default UserAdmin for extra features
@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    # Here, you can specify fields to display in the admin list view
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    # Fieldsets to customize admin detail view for the User model
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )

# Register Trainer model as it is
admin.site.register(Trainer)
