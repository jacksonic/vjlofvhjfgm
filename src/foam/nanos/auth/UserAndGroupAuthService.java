package foam.nanos.auth;

import foam.core.ContextAwareSupport;
import foam.core.X;
import foam.dao.*;
import foam.util.LRULinkedHashMap;

import javax.security.auth.login.LoginException;
import java.util.*;

/**
 * Created by marcroopchand on 2017-05-12.
 */
public class UserAndGroupAuthService
  extends    ContextAwareSupport
  implements AuthService
{
  protected DAO userDAO_;
  protected DAO groupDAO_;
  protected Map challengeMap;

  @Override
  public void start() {
    userDAO_      = (DAO) getX().get("userDAO");
    groupDAO_     = (DAO) getX().get("groupDAO");
    challengeMap  = new LRULinkedHashMap<Long, Challenge>(20000);
  }

  /**
   * A challenge is generated from the userID provided
   * This is saved in a LinkedHashMap with ttl of 5
   *
   * Should this throw an exception?
   */
  public String generateChallenge(long userId) {
    if ( userId < 1 ) return null;
    if ( userDAO_.find(userId) == null )  return null;

    String   generatedChallenge = UUID.randomUUID() + String.valueOf(userId);
    Calendar calendar           = Calendar.getInstance();
    calendar.add(Calendar.SECOND, 5);

    challengeMap.put(userId, new Challenge(generatedChallenge, calendar.getTime()));

    return generatedChallenge;
  }

  /**
   * Checks the LinkedHashMap to see if the the challenge supplied is correct
   * and the ttl is still valid
   *
   * How often should we purge this map for challenges that have expired?
   */
  public X challengedLogin(long userId, String challenge) throws RuntimeException {
    if ( userId < 1 || challenge == null  || challenge == "" ) {
      throw new RuntimeException("Invalid Parameters");
    }

    Challenge c = (Challenge) challengeMap.get(userId);
    if ( c == null ) throw new RuntimeException("Invalid userId");

    if ( ! c.getChallenge().equals(challenge) ) {
      throw new RuntimeException("Invalid Challenge");
    }

    if ( new Date().after(c.getTtl()) ) {
      challengeMap.remove(userId);
      throw new RuntimeException("Challenge expired");
    }

    User user = (User) userDAO_.find(userId);
    if ( user == null ) throw new RuntimeException("User not found");

    challengeMap.remove(userId);
    return this.getX().put("user", user);
  }

  /**
   * Login a user by the id provided, validate the password
   * and return the user in the context.
   */
  public X login(long userId, String password) throws RuntimeException {
    if ( userId < 1 || password == null || password == "" ) {
      throw new RuntimeException("Invalid Parameters");
    }

    User user = (User) userDAO_.find(userId);
    if ( user == null ) throw new RuntimeException("User not found.");

    if ( ! user.getPassword().equals(password) ) {
      throw new RuntimeException("Invalid Password");
    }

    return this.getX().put("user", user);
  }

  /**
   * Check if the user in the context supplied has the right permission
   * Return Boolean for this
   */
  public Boolean check(foam.core.X x, java.security.Permission permission) {
    if ( x == null || permission == null ) return false;

    User user = (User) x.get("user");
    if ( user == null ) return false;

    Group group = (Group) user.getGroup();
    if ( group == null ) return false;

    if ( userDAO_.find_(x, user.getId()) == null ) {
      return false;
    }

    return group.implies(permission);
  }

  /**
   * Given a context with a user, validate the password to be updated
   * and return a context with the updated user information
   */
  public X updatePassword(foam.core.X x, String oldPassword, String newPassword)
    throws RuntimeException {

    if ( x == null || oldPassword == null || newPassword == null
      || oldPassword == "" || newPassword == "" ) {
      throw new RuntimeException("Invalid Parameters");
    }

    if ( oldPassword.equals(newPassword) ) {
      throw new RuntimeException("New Password must be different");
    }

    User user = (User) userDAO_.find_(x, ((User) x.get("user")).getId());
    if ( user == null ) {
      throw new RuntimeException("User not found");
    }

    if ( ! oldPassword.equals(user.getPassword()) ) {
      throw new RuntimeException("Invalid Password");
    }

    user.setPassword(newPassword);
    userDAO_.put(user);

    return this.getX().put("user", user);
  }

  /**
   * Used to validate properties of a user. This will be called on registration of users
   * Will mainly be used as a veto method.
   * Users should have id, email, first name, last name, password for registration
   */
  public void validateUser(User user) throws RuntimeException {
    if ( user == null ) {
      throw new RuntimeException("Invalid User");
    }

    if ( user.getEmail() == "" ) {
      throw new RuntimeException("Email is required for creating a user");
    }

    if ( user.getFirstName() == "" ) {
      throw new RuntimeException("First Name is required for creating a user");
    }

    if ( user.getLastName() == "" ) {
      throw new RuntimeException("Last Name is required for creating a user");
    }

    if ( user.getPassword() == "" ) {
      throw new RuntimeException("Password is required for creating a user");
    }
  }

  /**
   * Just return a null user for now. Not sure how to handle the cleanup
   * of the current context
   */
  public void logout(X x) {}
}
