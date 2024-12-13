package services;

import com.google.gson.Gson;
import database.tables.EditIncidentsTable;
import mainClasses.Incident;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static services.StandardResponse.*;
import static spark.Spark.*;
import static utility.Resources.*;

public class RESTAPI {
    static final String API_PATH = "E199API/";

    public static void main(String[] args) {
        RESTAPIGet.startGetApi();
        RESTAPIPost.startPostApi();
        RESTAPIPut.startPutApi();
        RESTAPIDelete.startDeleteApi();
    }
}
