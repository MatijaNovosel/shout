drop view if exists conversations_view;
create view conversations_view as
select c.id, cu.user_id
from conversation_users as cu
join conversations as c on c.id = cu.conversation_id;
