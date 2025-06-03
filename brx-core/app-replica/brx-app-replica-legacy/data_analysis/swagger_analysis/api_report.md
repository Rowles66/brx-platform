# BRX Performance API Analysis Report

Generated from swagger.yaml on /Users/joshrowles/github/brx-app-replica

## API Information
- **Title:** API V4
- **Version:** v4
- **Base Path:** 
- **Schemes:** 

## Security
{}

## Endpoints Summary

| Method | Path | Summary | Tags |
|--------|------|---------|------|
| GET | `/api/v3/equipment` | list equipment | Equipment |
| POST | `/api/v3/equipment` | create equipment | Equipment |
| PUT | `/api/v3/equipment/{id}` | update equipment | Equipment |
| DELETE | `/api/v3/equipment/{id}` | delete equipment | Equipment |
| GET | `/api/v3/workout_blocks` | list workout_blocks | Workout Blocks |
| POST | `/api/v3/workout_blocks` | create workout_block | Workout Blocks |
| PUT | `/api/v3/workout_blocks/{id}` | update workout_block | Workout Blocks |
| DELETE | `/api/v3/workout_blocks/{id}` | delete workout_block | Workout Blocks |
| POST | `/api/v3/workout_exercise_sets` | create workout_exercise_set | Workout Exercise Sets |
| PUT | `/api/v3/workout_exercise_sets/{id}` | update workout_exercise_set | Workout Exercise Sets |
| DELETE | `/api/v3/workout_exercise_sets/{id}` | delete workout_exercise_set | Workout Exercise Sets |
| POST | `/api/v3/plan_blocks` | create plan_block | Plan Blocks |
| PUT | `/api/v3/plan_blocks/{id}` | update plan_block | Plan Blocks |
| DELETE | `/api/v3/plan_blocks/{id}` | delete plan_block | Plan Blocks |
| POST | `/api/v3/plan_exercises` | create plan_exercise | Plan Exercises |
| PUT | `/api/v3/plan_exercises/{id}` | update plan_exercise | Plan Exercises |
| DELETE | `/api/v3/plan_exercises/{id}` | delete plan_exercise | Plan Exercises |
| GET | `/api/v4/calendar` | list calendar events | Calendar |
| POST | `/api/v4/calendar/add` | add a PlanWorkout to a calendar | Calendar |
| DELETE | `/api/v4/calendar/remove` | delete scheduled workout | Calendar |
| PUT | `/api/v4/calendar/move` | move a scheduled workout | Calendar |
| POST | `/api/v4/calendar/schedule` | schdule a logged workout | Calendar |
| GET | `/api/v4/carts/purchased_items` | purchased_items cart | Purchased Items |
| GET | `/api/v4/conversations/available_recipients` | available_recipients conversation | Conversations |
| PUT | `/api/v4/conversations/{id}/reply_to` | reply_to conversation | Conversations |
| GET | `/api/v4/conversations/{id}/mark_read` | mark_read conversation | Conversations |
| GET | `/api/v4/conversations` | list conversations | Conversations |
| POST | `/api/v4/conversations` | create conversation | Conversations |
| GET | `/api/v4/conversations/{id}` | show conversation | Conversations |
| PUT | `/api/v4/conversations/{id}` | update conversation | Conversations |
| DELETE | `/api/v4/conversations/{id}` | delete conversation | Conversations |
| POST | `/api/v4/coupons/check` | check coupon | Coupons |
| GET | `/api/v4/exercises` | list exercises | Exercises |
| GET | `/api/v4/exercises/{id}` | show exercise | Exercises |
| PUT | `/api/v4/exercises/{id}` | update exercise | Exercises |
| POST | `/api/v4/exercises/` | create exercise | Exercises |
| GET | `/api/v4/favorites` | list favorites | Favorites |
| GET | `/api/v4/fbm/appointments/{id}/check_eligibility` | check_eligibility appointment | Appointments |
| GET | `/api/v4/fbm/appointments/{id}/packages` | packages appointment | Appointments |
| GET | `/api/v4/fbm/appointments` | list appointments | Appointments |
| POST | `/api/v4/fbm/appointments` | create appointment | Appointments |
| GET | `/api/v4/fbm/appointments/{id}` | show appointment | Appointments |
| PUT | `/api/v4/fbm/appointments/{id}` | update appointment | Appointments |
| DELETE | `/api/v4/fbm/appointments/{id}` | delete appointment | Appointments |
| GET | `/api/v4/fbm/locations` | list locations | Locations |
| POST | `/api/v4/fbm/locations` | create location | Locations |
| GET | `/api/v4/fbm/locations/{id}` | show location | Locations |
| PUT | `/api/v4/fbm/locations/{id}` | update location | Locations |
| DELETE | `/api/v4/fbm/locations/{id}` | delete location | Locations |
| GET | `/api/v4/fbm/scheduled_appointment_members` | list scheduled_appointment_members | Scheduled Appointment Members |
| POST | `/api/v4/fbm/scheduled_appointment_members` | create scheduled_appointment_member | Scheduled Appointment Members |
| GET | `/api/v4/fbm/scheduled_appointment_members/{id}` | show scheduled_appointment_member | Scheduled Appointment Members |
| PUT | `/api/v4/fbm/scheduled_appointment_members/{id}` | update scheduled_appointment_member | Scheduled Appointment Members |
| DELETE | `/api/v4/fbm/scheduled_appointment_members/{id}` | delete scheduled_appointment_member | Scheduled Appointment Members |
| GET | `/api/v4/fbm/scheduled_appointments/{id}/check_eligibility` | check_eligibility scheduled_appointment | Sheduled Appointments |
| GET | `/api/v4/fbm/scheduled_appointments` | list scheduled_appointments | Sheduled Appointments |
| POST | `/api/v4/fbm/scheduled_appointments` | create scheduled_appointment | Sheduled Appointments |
| GET | `/api/v4/fbm/scheduled_appointments/{id}` | show scheduled_appointment | Sheduled Appointments |
| PUT | `/api/v4/fbm/scheduled_appointments/{id}` | update scheduled_appointment | Sheduled Appointments |
| DELETE | `/api/v4/fbm/scheduled_appointments/{id}` | delete scheduled_appointment | Sheduled Appointments |
| GET | `/api/v4/fbm/schedules` | list schedules | Schedules |
| POST | `/api/v4/fbm/schedules` | create schedule | Schedules |
| GET | `/api/v4/fbm/schedules/{id}` | show schedule | Schedules |
| PUT | `/api/v4/fbm/schedules/{id}` | update schedule | Schedules |
| DELETE | `/api/v4/fbm/schedules/{id}` | delete schedule | Schedules |
| GET | `/api/v4/fbm/services` | list services | Services |
| POST | `/api/v4/fbm/services` | create service | Services |
| GET | `/api/v4/fbm/services/{id}` | show service | Services |
| PUT | `/api/v4/fbm/services/{id}` | update service | Services |
| DELETE | `/api/v4/fbm/services/{id}` | delete service | Services |
| GET | `/api/v4/fbm/visits` | list visits | Visits |
| POST | `/api/v4/fbm/visits` | create visit | Visits |
| GET | `/api/v4/fbm/visits/{id}` | show visit | Visits |
| PUT | `/api/v4/fbm/visits/{id}` | update visit | Visits |
| DELETE | `/api/v4/fbm/visits/{id}` | delete visit | Visits |
| GET | `/api/v4/fbm/waitlist_entries` | list waitlist_entries | Waitlist Entries |
| POST | `/api/v4/fbm/waitlist_entries` | create waitlist_entry | Waitlist Entries |
| GET | `/api/v4/fbm/waitlist_entries/{id}` | show waitlist_entry | Waitlist Entries |
| PUT | `/api/v4/fbm/waitlist_entries/{id}` | update waitlist_entry | Waitlist Entries |
| DELETE | `/api/v4/fbm/waitlist_entries/{id}` | delete waitlist_entry | Waitlist Entries |
| GET | `/api/v4/group_resources` | list group_resources | Group Resources |
| POST | `/api/v4/group_resources` | create group_resource | Group Resources |
| GET | `/api/v4/group_resources/{id}` | show group_resource | Group Resources |
| POST | `/api/v4/groups/{id}/add_member` | add_member group | Groups |
| GET | `/api/v4/groups/calendars` | calendars group | Groups |
| GET | `/api/v4/groups` | list groups | Groups |
| POST | `/api/v4/groups` | create group | Groups |
| GET | `/api/v4/groups/{id}` | show group | Groups |
| PUT | `/api/v4/groups/{id}` | update group | Groups |
| DELETE | `/api/v4/groups/{id}` | delete group | Groups |
| GET | `/api/v4/resources` | list resources | Resources |
| POST | `/api/v4/resources` | create resource | Resources |
| GET | `/api/v4/resources/{id}` | show resource | Resources |
| POST | `/api/v4/users/sign_in` | Sign in | Authentication |
| DELETE | `/api/v4/sign_out` | Sign out | Authentication |
| POST | `/api/v4/users/password` | Reset Password | Authentication |
| POST | `/api/v4/tags` | create tag | Tags |
| GET | `/api/v4/tags` | list tags | Tags |
| PUT | `/api/v4/tags/{id}` | update tag | Tags |
| GET | `/api/v4/tags/{id}` | show tag | Tags |
| DELETE | `/api/v4/tags/{id}` | delete tag | Tags |
| POST | `/api/v4/tags/update_tag` | update tag | Tags |
| POST | `/api/v4/tags/delete_tag` | delete tag | Tags |
| GET | `/api/v4/user_plans` | list user_plans | User Plans |
| POST | `/api/v4/user_plans` | create user_plan | User Plans |
| GET | `/api/v4/user_plans/{id}` | show user_plan | User Plans |
| PUT | `/api/v4/user_plans/{id}` | update user_plan | User Plans |
| DELETE | `/api/v4/user_plans/{id}` | delete user_plan | User Plans |
| POST | `/api/v4/user_plans/{id}/pause` | pasue a user plan | User Plans |
| GET | `/api/v4/user_plans/{id}/next_workout` | get next workout for resume | User Plans |
| GET | `/api/v4/users` | list users | Users |
| POST | `/api/v4/users` | create user | Users |
| GET | `/api/v4/users/{id}/workout_exercises` | show user's workout exercises | Users |
| GET | `/api/v4/users/{id}` | show user | Users |
| DELETE | `/api/v4/users/{id}` | delete user | Users |
| GET | `/api/v4/workout_exercises` | list workout_exercises | Workout Exercises |
| POST | `/api/v4/workout_exercises` | create workout_exercise | Workout Exercises |
| GET | `/api/v4/workout_exercises/{id}` | show workout_exercise | Workout Exercises |
| PUT | `/api/v4/workout_exercises/{id}` | update workout_exercise | Workout Exercises |
| DELETE | `/api/v4/workout_exercises/{id}` | delete workout_exercise | Workout Exercises |
| GET | `/api/v4/plan_workouts` | list plan_workouts | Plan Workouts |
| POST | `/api/v4/plan_workouts` | create plan_workout | Plan Workouts |
| PUT | `/api/v4/plan_workouts/{id}` | update workout_plan_workout | Plan Workouts |
| GET | `/api/v4/plan_workouts/{id}` | show workout_plan_workout | Plan Workouts |
| DELETE | `/api/v4/plan_workouts/{id}` | delete plan_workout | Plan Workouts |
| GET | `/api/v4/workout-plans` | list workout_plans | Workout Plans |
| POST | `/api/v4/workout-plans` | create workout_plan | Workout Plans |
| GET | `/api/v4/workout-plans/{id}` | show workout_plan | Workout Plans |
| PUT | `/api/v4/workout-plans/{id}` | update workout_plan | Workout Plans |
| DELETE | `/api/v4/workout-plans/{id}` | delete workout_plan | Workout Plans |
| GET | `/api/v4/workout-plans/{id}/rep_maxes` | user rep rep maxes associated with a plan | Workout Plans |
| GET | `/api/v4/workouts` | list workouts | Workouts |
| POST | `/api/v4/workouts` | create workout | Workouts |
| GET | `/api/v4/workouts/{id}` | show workout | Workouts |
| PUT | `/api/v4/workouts/{id}` | update workout | Workouts |
| DELETE | `/api/v4/workouts/{id}` | delete workout | Workouts |

## Data Models

