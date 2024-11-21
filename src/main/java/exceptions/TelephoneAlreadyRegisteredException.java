package exceptions;

public class TelephoneAlreadyRegisteredException extends RuntimeException {
    public TelephoneAlreadyRegisteredException(String message) {
        super(message);
    }
}
