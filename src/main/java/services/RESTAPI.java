package services;

public class RESTAPI {
    static final String API_PATH = "E199API/";

    public static void main(String[] args) {

//        get(apiPath + "/laptops", (request, response) -> {
//            response.status(200);
//            response.type("application/json");
//            return new Gson().toJson(new StandardResponse(new Gson().toJsonTree(laptops)));
//        });
//
//        post(apiPath + "/newLaptop", (request, response) -> {
//            response.type("application/json");
//            Laptop lap = new Gson().fromJson(request.body(), Laptop.class);
//            if (laptops.containsKey(lap.name)) {
//                response.status(400);
//                return new Gson().toJson(new StandardResponse(new Gson()
//                        .toJson("Error: Laptop Exists")));
//
//            } else {
//                laptops.put(lap.name, lap);
//                response.status(200);
//                return new Gson().toJson(new StandardResponse(new Gson()
//                        .toJson("Success: Laptop Added")));
//            }
//        });
//
//        put(apiPath + "/laptopQuantity/:name/:quantity", (request, response) -> {
//            response.type("application/json");
//            if (laptops.containsKey(request.params(":name")) == false) {
//                response.status(404);
//                return new Gson().toJson(new StandardResponse(new Gson().toJson("Laptop  not found")));
//            } else if (Integer.parseInt(request.params(":quantity")) <= 0) {
//                response.status(406);
//                return new Gson().toJson(new StandardResponse(new Gson().toJson("Quantity must be over 0")));
//            } else {
//                Laptop p = laptops.get(request.params(":name"));
//                p.quantity += Integer.parseInt(request.params(":quantity"));
//                return new Gson().toJson(new StandardResponse(new Gson().toJson("Success: Quantity Updated")));
//            }
//        });
//
//        delete(apiPath + "/laptop/:name", (request, response) -> {
//            response.type("application/json");
//            if (laptops.containsKey(request.params(":name"))) {
//                laptops.remove(request.params(":name"));
//                return new Gson().toJson(new StandardResponse(new Gson().toJson("Laptop Deleted")));
//            } else {
//                response.status(404);
//                return new Gson().toJson(new StandardResponse(new Gson().toJson("Error: Laptop  not found")));
//            }
//        });

    }
}
