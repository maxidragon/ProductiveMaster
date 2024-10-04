import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'productivemaster.settings')
django.setup()

from daily_tasks.cron import move_uncompleted_tasks_to_the_next_day
from datetime import datetime, timedelta

def main():
    print('Running daily tasks')
    move_uncompleted_tasks_to_the_next_day()
    
if __name__ == '__main__':
    main()

    