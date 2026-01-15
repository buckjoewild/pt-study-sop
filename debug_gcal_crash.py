import sys
import os
from datetime import datetime

# Add project root to path
sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'brain'))

try:
    print("Importing gcal...")
    from brain.dashboard import gcal
    
    print("Loading config...")
    config = gcal.load_gcal_config()
    
    print("Fetching calendar list...")
    calendars, error = gcal.fetch_calendar_list()
    if error:
        print(f"Error fetching calendars: {error}")
        sys.exit(1)
        
    print(f"Found {len(calendars)} calendars.")
    
    print("Resolving selection...")
    selected_ids, _, _, calendar_meta = gcal.resolve_calendar_selection(config, calendars)
    print(f"Selected IDs: {selected_ids}")
    
    print("Fetching events (days_ahead=90)...")
    # Simulate the API call
    events, error = gcal.fetch_calendar_events(selected_ids, calendar_meta, days_ahead=90)
    
    if error:
        print(f"Error fetching events: {error}")
    else:
        print(f"Successfully fetched {len(events)} events.")
        
    print("Fetching Tasks...")
    task_lists, error = gcal.fetch_task_lists()
    if task_lists:
        print(f"Found {len(task_lists)} task lists. Fetching first list...")
        tasks, error = gcal.fetch_tasks(task_lists[0]["id"])
        print(f"Fetched {len(tasks)} tasks.")
        
    print("DONE. No crash.")

except Exception as e:
    print("CRASHED!")
    import traceback
    traceback.print_exc()
