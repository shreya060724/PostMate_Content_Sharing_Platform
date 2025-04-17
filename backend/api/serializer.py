from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from api import models as api_models


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
  @classmethod
  #decorator means this method is a class method, so it can be called on the class itself , cls = class itself
  def get_token(cls, user):
    token = super().get_token(user)
    #calls the get_token method from the parent class (TokenObtainPairSerializer).generates the standard JWT token
    token['full_name'] = user.full_name
    token['email'] = user.email
    token['username'] = user.username
    return token


class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
  password2 = serializers.CharField(write_only=True, required=True)

  class Meta:
    # Specify the model that this serializer is associated with
    model = api_models.User
    # Define the fields from the model that should be included in the serializer
    fields = ('full_name', 'email', 'password', 'password2')

  def validate(self, attrs):
    # Define a validation method to check if the passwords match
    if attrs['password'] != attrs['password2']:
      # Raise a validation error if the passwords don't match
      raise serializers.ValidationError({"password": "Password fields didn't match."})
    # Return the validated attributes
    return attrs

  def create(self, validated_data):
    # Define a method to create a new user based on validated data
    user = api_models.User.objects.create(
      full_name=validated_data['full_name'],
      email=validated_data['email'],
    )
    email_username, mobile = user.email.split('@')
    user.username = email_username
    # Set the user's password based on the validated data
    user.set_password(validated_data['password'])
    user.save()
    # Return the created user
    return user


class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = api_models.User
    fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = api_models.Profile
    fields = '__all__'
  def to_representation(self, instance):
    response = super().to_representation(instance)
    response['user'] = UserSerializer(instance.user).data
    return response


class PasswordResetSerializer(serializers.Serializer):
  email = serializers.EmailField()


class CategorySerializer(serializers.ModelSerializer):
  post_count = serializers.SerializerMethodField()

  def get_post_count(self, category):
    return category.posts.count()
  #count no. of post related to that particular category

  class Meta:
    model = api_models.Category
    fields = [
      "id",
      "title",
      "image",
      "slug",
      "post_count",
    ]

  def __init__(self, *args, **kwargs):
    
    #This line calls the parent class (ModelSerializer) constructor. It ensures the serializer is properly initialized.
    super(CategorySerializer, self).__init__(*args, **kwargs)

    #This line retrieves the current request object from the context passed to the serializer.self.context is a dictionary that typically contains data such as the current HTTP request. The request object is often needed to adjust the behavior of the serializer based on the HTTP method (GET, POST, etc.).
    request = self.context.get('request')

    if request and request.method == 'POST':
      self.Meta.depth = 0
    else:
      self.Meta.depth = 3


class CommentSerializer(serializers.ModelSerializer):
  class Meta:
    model = api_models.Comment
    fields = "__all__"

  def __init__(self, *args, **kwargs):
    super(CommentSerializer, self).__init__(*args, **kwargs)
    request = self.context.get('request')
    if request and request.method == 'POST':
      self.Meta.depth = 0
    else:
      self.Meta.depth = 1


class PostSerializer(serializers.ModelSerializer):
  comments = CommentSerializer(many=True)

  class Meta:
    model = api_models.Post
    fields = "__all__"

  def __init__(self, *args, **kwargs):
    super(PostSerializer, self).__init__(*args, **kwargs)
    request = self.context.get('request')
    if request and request.method == 'POST':
      self.Meta.depth = 0
    else:
      self.Meta.depth = 3


class BookmarkSerializer(serializers.ModelSerializer):
  class Meta:
    model = api_models.Bookmark
    fields = "__all__"

  def __init__(self, *args, **kwargs):
    super(BookmarkSerializer, self).__init__(*args, **kwargs)
    request = self.context.get('request')
    if request and request.method == 'POST':
      self.Meta.depth = 0
    else:
      self.Meta.depth = 3


class NotificationSerializer(serializers.ModelSerializer):
  class Meta:
    model = api_models.Notification
    fields = "__all__"

  def __init__(self, *args, **kwargs):
    super(NotificationSerializer, self).__init__(*args, **kwargs)
    request = self.context.get('request')
    if request and request.method == 'POST':
      self.Meta.depth = 0
    else:
      self.Meta.depth = 3


class AuthorStats(serializers.Serializer):
  views = serializers.IntegerField(default=0)
  posts = serializers.IntegerField(default=0)
  likes = serializers.IntegerField(default=0)
  bookmarks = serializers.IntegerField(default=0)
