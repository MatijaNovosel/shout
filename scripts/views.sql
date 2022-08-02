drop view if exists conversation_users_view;
create view conversation_users_view as
select u.email, cu.conversation_id, cu.user_id
from conversation_users as cu
join conversations as c on c.id = cu.conversation_id
join auth.users as u on u.id = cu.user_id
where cu.conversation_id = 1