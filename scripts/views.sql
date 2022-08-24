drop view if exists conversation_users_view;
create view conversation_users_view as
select cu.conversation_id, u.email, cu.user_id, p.username, p.shorthand_id
from conversation_users as cu
join conversations as c on c.id = cu.conversation_id
join auth.users as u on u.id = cu.user_id
join profiles as p on p.id = cu.user_id;

drop view if exists user_msg_view;
create view user_msg_view as
select m.*, p.username
from messages as m
join profiles as p on p.id = m.user_id;

