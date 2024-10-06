from .models import DailyTask
from datetime import datetime, timedelta

def move_uncompleted_tasks_to_the_next_day():
    print('Moving uncompleted tasks to the next day')
    yesterday = (datetime.now().date() - timedelta(days=1)).strftime("%Y-%m-%d")
    date_obj = datetime.strptime(yesterday, "%Y-%m-%d")
    uncompleted_tasks = DailyTask.objects.filter(
            date__year=date_obj.year, date__month=date_obj.month, date__day=date_obj.day, completed_at=None)
    for task in uncompleted_tasks:
        task.date = datetime.now().date()
        task.save()
    