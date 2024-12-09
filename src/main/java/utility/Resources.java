package utility;

public class Resources {
    public static final String USERTYPE_USER = "user";
    public static final String USERTYPE_ADMIN = "admin";
    public static final String USERTYPE_GUEST = "guest";
    public static final String USERTYPE_VOLUNTEER = "volunteer";

    public static final String INCIDENTTYPE_FIRE = "fire";
    public static final String INCIDENTTYPE_ACCIDENT = "accident";

    public static final String PREFECTURE_CHANIA = "Chania";
    public static final String PREFECTURE_RETHYMNO = "Rethymno";
    public static final String PREFECTURE_HERAKLION = "Heraklion";
    public static final String PREFECTURE_LASITHI = "Lasithi";

    public static final String INCIDENT_STATUS_SUBMITTED = "submitted";
    public static final String INCIDENT_STATUS_RUNNING = "running";
    public static final String INCIDENT_STATUS_FINISHED = "finished";
    public static final String INCIDENT_STATUS_FAKE = "fake";
    public static final String INCIDENT_DANGER_UNKNOWN = "unknown";
    public static final String[] INCIDENT_STATUSES = new String[] {INCIDENT_STATUS_FINISHED, INCIDENT_STATUS_RUNNING, INCIDENT_STATUS_SUBMITTED, INCIDENT_STATUS_FAKE};

    public static final int MIN_PHONE_LENGTH = 10;
    public static final int MAX_PHONE_LENGTH = 14;
}
