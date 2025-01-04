package utility;

public class Resources {
    public static final String USER_TYPE_USER = "user";
    public static final String USER_TYPE_ADMIN = "admin";
    public static final String USER_TYPE_GUEST = "guest";
    public static final String USER_TYPE_VOLUNTEER = "volunteer";
    public static final String[] USER_TYPES = new String[]{USER_TYPE_USER, USER_TYPE_GUEST, USER_TYPE_VOLUNTEER, USER_TYPE_ADMIN};

    public static final String CHATTYPE_PUBLIC = "public";
    public static final String CHATTYPE_VOLUNTEERS = "volunteers";
    public static final String CHATTYPE_ADMIN = USER_TYPE_ADMIN;
    public static final String[] PREDEFINED_USERNAMES = new String[]{USER_TYPE_USER, USER_TYPE_GUEST, USER_TYPE_VOLUNTEER, USER_TYPE_ADMIN, CHATTYPE_PUBLIC, CHATTYPE_VOLUNTEERS};
    public static final String[] RECIPIENT_LISTS = new String[]{CHATTYPE_ADMIN, CHATTYPE_VOLUNTEERS, CHATTYPE_PUBLIC};

    public static final String INCIDENT_TYPE_FIRE = "fire";
    public static final String INCIDENT_TYPE_ACCIDENT = "accident";
    public static final String[] INCIDENT_TYPES = new String[]{INCIDENT_TYPE_FIRE, INCIDENT_TYPE_ACCIDENT};

    public static final String PREFECTURE_CHANIA = "Chania";
    public static final String PREFECTURE_RETHYMNO = "Rethymno";
    public static final String PREFECTURE_HERAKLION = "Heraklion";
    public static final String PREFECTURE_LASITHI = "Lasithi";
    public static final String[] PREFECTURES = new String[]{PREFECTURE_CHANIA, PREFECTURE_RETHYMNO, PREFECTURE_HERAKLION, PREFECTURE_LASITHI};

    public static final String INCIDENT_STATUS_SUBMITTED = "submitted";
    public static final String INCIDENT_STATUS_RUNNING = "running";
    public static final String INCIDENT_STATUS_FINISHED = "finished";
    public static final String INCIDENT_STATUS_FAKE = "fake";
    public static final String[] INCIDENT_STATUSES = new String[]{INCIDENT_STATUS_SUBMITTED, INCIDENT_STATUS_RUNNING, INCIDENT_STATUS_FINISHED, INCIDENT_STATUS_FAKE};

    public static final String INCIDENT_DANGER_UNKNOWN = "unknown";

    public static final String VOLUNTEER_TYPE_SIMPLE = "simple";
    public static final String VOLUNTEER_TYPE_DRIVER = "driver";
    public static final String[] VOLUNTEER_TYPES = new String[]{VOLUNTEER_TYPE_SIMPLE, VOLUNTEER_TYPE_DRIVER};

    public static final String PARTICIPANT_SUCCESS_YES = "yes";
    public static final String PARTICIPANT_SUCCESS_NO = "no";
    public static final String[] PARTICIPANT_SUCCESSOUTCOMES = new String[]{PARTICIPANT_SUCCESS_YES, PARTICIPANT_SUCCESS_NO};

    public static final int MIN_PHONE_LENGTH = 10;
    public static final int MAX_PHONE_LENGTH = 14;
}
