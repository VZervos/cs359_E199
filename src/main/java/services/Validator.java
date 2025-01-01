package services;

import exceptions.UsernameAlreadyRegisteredException;
import mainClasses.User;
import mainClasses.Volunteer;
import utility.Utility;

import java.sql.SQLException;
import java.util.Arrays;
import java.util.Objects;

import static utility.Resources.PREDEFINED_USERNAMES;

public class Validator {
    static boolean isUsernameUnique(String sender) throws SQLException, ClassNotFoundException {
        try {
            if (Utility.isInTable(sender, PREDEFINED_USERNAMES))
                throw new UsernameAlreadyRegisteredException(sender);
            User.checkCredentialsUniqueness(sender, null, null);
            Volunteer.checkCredentialsUniqueness(sender, null, null);
            return true;
        } catch (UsernameAlreadyRegisteredException _) {
        }
        return false;
    }

    public boolean isNumber(String id) {
        try {
            Integer.parseInt(id);
        } catch (NumberFormatException e) {
            return false;
        }
        return true;
    }

    public boolean hasNullItems(Object[] items) {
        return Arrays.stream(items).anyMatch(Objects::isNull);
    }

}
