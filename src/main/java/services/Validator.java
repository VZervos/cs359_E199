package services;

import java.util.Arrays;
import java.util.Objects;

public class Validator {
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
