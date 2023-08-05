from rest_framework.pagination import PageNumberPagination

class TasksPaginator(PageNumberPagination):
    page_size = 10