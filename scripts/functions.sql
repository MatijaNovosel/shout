CREATE OR REPLACE FUNCTION onSignUpCreateProfilesFunction()
RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.profiles (id, username, updatedAt, avatarUrl, shorthandId, lang)
    VALUES(new.id, 'username', now(), '/plenkovic.jpg', 'shorthand', 'en');
    RETURN NEW;
  END;
$$
LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS signUpCreateProfilesTrigger on auth.users;
CREATE TRIGGER signUpCreateProfilesTrigger
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE onSignUpCreateProfilesFunction();