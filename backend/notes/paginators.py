from rest_framework.pagination import PageNumberPagination

class NotePaginator(PageNumberPagination):
    page_size = 1000