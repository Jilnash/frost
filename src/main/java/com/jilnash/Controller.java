package com.jilnash;


import com.jilnash.model.*;
import com.jilnash.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;

@RestController
@RequestMapping
public class Controller {

    @Autowired
    Validator validator;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CountryRepository countryRepository;

    @Autowired
    RegionRepository regionRepository;

    @Autowired
    BrandRepository brandRepository;

    @Autowired
    ModelRepository modelRepository;

    @Autowired
    GenerationRepository generationRepository;

    @Autowired
    ProductGenerationRepository productGenerationRepository;

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderContentRepository orderContentRepository;

    @Autowired
    OrderProductRepository orderProductRepository;

    @Autowired
    StockRepository stockRepository;

    @Autowired
    StatusRepository statusRepository;

    @GetMapping("/products")
    public List<Product> getProducts(
            @RequestParam(name = "pattern", required = false) String pattern,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "brand", required = false) String brand,
            @RequestParam(name = "model", required = false) String model,
            @RequestParam(name = "generation", required = false) String generation,
            @RequestParam(name = "instock", required = false) String instock) {

        List<Product> products = productRepository.findAll();
        Set<Product> wrong = new LinkedHashSet<>();

        if (pattern != null) {

            products.forEach(p -> {
                        if (!p.getName().contains(pattern) &&
                                !p.getArticle().contains(pattern))
                            wrong.add(p);
                    }
            );
        }

        if (category != null) {

            products.forEach(p -> {
                        if (!p.getCategory().getName().equals(category))
                            wrong.add(p);
                    }
            );
        }

        if (brand != null) {

            for (Product p : products) {

                boolean contains = false;
                Brand containedB = null;
                Model containedM = null;

                for (ProductGeneration pg : p.getProductGenerations()) {

                    if (pg.getGeneration().getModel().getBrand().getName().equals(brand)) {

                        containedB = pg.getGeneration().getModel().getBrand();
                        contains = true;
                        break;
                    }
                }

                if(!contains) {

                    wrong.add(p);
                } else {

                    if(model != null) {

                        contains = false;

                        for(Model m: containedB.getModels()) {

                            if(m.getName().equals(model)) {

                                containedM = m;
                                contains = true;
                                break;
                            }
                        }
                    }

                    if(!contains) {

                        wrong.add(p);
                    } else {

                        if(generation != null) {

                            contains = false;

                            for(Generation g: containedM.getGenerations()) {

                                if(g.getName().equals(generation)) {

                                    contains = true;
                                    break;
                                }
                            }
                        }

                        if(!contains)
                            wrong.add(p);
                    }
                }
            }
        }

        if (instock != null) {

            for (Product p : products) {

                int count = 0;

                for (Instock i : p.getInstocks())
                    count += i.getCount();

                if (count == 0)
                    wrong.add(p);
            }
        }

        List<Product> result = new LinkedList<>();

        products.forEach(p -> {

            if (!wrong.contains(p))
                result.add(p);
        });

        return result;
    }

    @GetMapping("/products/{id}")
    public Product getProduct(@PathVariable Long id) {

        return productRepository.findById(id).get();
    }

    @PostMapping("/product/validate")
    public Map<String, String> validateProduct(@RequestBody Map<String, String> map) {

        Product product = new Product();

        if (!map.get("name").isEmpty())
            product.setName(map.get("name"));

        if (!map.get("article").isEmpty())
            product.setArticle(map.get("article"));

        if (!map.get("manufacturer").isEmpty())
            product.setManufacturer(map.get("manufacturer"));

        if (!map.get("description").isEmpty())
            product.setDescription(map.get("description"));

        if (!map.get("price").isEmpty())
            product.setPrice(Double.valueOf(map.get("price")));

        Set<ConstraintViolation<Product>> constr = validator.validate(product);

        Map<String, String> validationMap = new HashMap<>();

        for (ConstraintViolation<Product> c : constr) {

            validationMap.put(c.getPropertyPath().toString(), c.getMessage());
        }

        return validationMap;
    }

    @PostMapping("/product")
    public void saveProduct(@RequestBody Map<String, String> map) {

        Product product = null;

        if(map.get("id") != null)
            product = productRepository.getOne(Long.valueOf(map.get("id")));
        else
            product = new Product();

        product.setName(map.get("name"));
        product.setArticle(map.get("article"));
        product.setManufacturer(map.get("manufacturer"));
        product.setDescription(map.get("description"));
        product.setPrice(Double.valueOf(map.get("price")));

        List<Generation> generations = new LinkedList<>();

        for(String id: map.get("generations").split(" "))
            generations.add(generationRepository.getOne(Long.valueOf(id)));

        generations.forEach(g -> {
            System.out.println(g.getName());
        });
    }

    @GetMapping("/orders")
    public List<Order> getOrders(@RequestParam(name = "id", required = false) Long id,
                                 @RequestParam(name = "after", required = false) String after,
                                 @RequestParam(name = "before", required = false) String before,
                                 @RequestParam(name = "status", required = false) Long status,
                                 @RequestParam(name = "phone", required = false) String phone) {

        List<Order> orders = orderRepository.findAll();
        List<Order> wrong = new LinkedList<>();

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);

        if(id != null)
            orders.forEach(o -> {
                if(o.getId() != id)
                    wrong.add(o);
            });

        if(after != null)
            orders.forEach(o -> {
                try {
                    if(o.getCreatedAt().before(format.parse(after)))
                        wrong.add(o);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            });

        if(before != null)
            orders.forEach(o -> {
                try {
                    if(o.getCreatedAt().after(format.parse(before)))
                        wrong.add(o);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            });

        if(status != null)
            orders.forEach(o -> {
                if(o.getStatus().getId() != status)
                    wrong.add(o);
            });

        if(phone != null)
            orders.forEach(o -> {
                if(!o.getPhone().equals(phone))
                    wrong.add(o);
            });

        List<Order> result = new LinkedList<>();

        orders.forEach(o -> {
            if(!wrong.contains(o))
                result.add(o);
        });

        return result;
    }

    @GetMapping("/statuses")
    public List<Status> getStatuses() {

        return statusRepository.findAll();
    }

    @GetMapping("/count")
    public Integer getCount(@RequestParam(name = "id") Long id) {

        Product product = productRepository.getOne(id);

        Integer count = 0;

        for(Instock i: product.getInstocks())
            count +=i.getCount();

        return count;
    }

    @GetMapping("/stocks")
    public List<Stock> getStocks() {

        return stockRepository.findAll();
    }

    @GetMapping("/categories")
    public List<Category> getCategories() {

        return categoryRepository.findAll();
    }

    @GetMapping("/brands")
    public List<Brand> getBrands() {

        return brandRepository.findAll();
    }

    @GetMapping("/models")
    public List<Model> getModels(@RequestParam(name = "brand") String brand) {

        return modelRepository.findAllByBrand(
                brandRepository.findByName(brand)
        );
    }

    @GetMapping("/generations")
    public List<Generation> getGenerations(@RequestParam(name = "model", required = false) String model) {

        if(model != null)
            return generationRepository.findAllByModel(
                modelRepository.findByName(model));

        return generationRepository.findAll();
    }

    @GetMapping("/countries")
    public List<Country> getCountries() {

        return countryRepository.findAll();
    }

    @GetMapping("/regions")
    public List<Region> getRegions() {

        return regionRepository.findAll();
    }

    @PostMapping("/user")
    public User user(@RequestBody Map<String, String> map) {

        return userRepository.findById(Long.valueOf(map.get("id"))).get();
    }

    @PostMapping("/login")
    public Long login(@RequestBody Map<String, String> map) {

        User user = userRepository.findByEmailAndPassword(
                map.get("email"),
                map.get("password")
        );

        if (user == null)
            return -1L;

        return user.getId();
    }

    @PostMapping("/user/validate")
    public Map<String, String> validateUser(@RequestBody Map<String, String> map) {

        User user = new User();

        if (!map.get("name").isEmpty())
            user.setName(map.get("name"));

        if (!map.get("surname").isEmpty())
            user.setSurname(map.get("surname"));

        if (!map.get("email").isEmpty())
            user.setEmail(map.get("email"));

        if (!map.get("password").isEmpty())
            user.setPassword(map.get("password"));

        Set<ConstraintViolation<User>> constr = validator.validate(user);

        Map<String, String> validationMap = new HashMap<>();

        for (ConstraintViolation<User> c : constr) {

            validationMap.put(c.getPropertyPath().toString(), c.getMessage());
        }

        return validationMap;
    }

    @PostMapping("/reg")
    public void reg(@RequestBody Map<String, String> map) {

        User user = new User();

        user.setRole(roleRepository.findById(2L).get());
        user.setName(map.get("name"));
        user.setSurname(map.get("surname"));
        user.setEmail(map.get("email"));
        user.setPassword(map.get("password"));

        userRepository.save(user);
    }

    @PostMapping("/user/validate/contacts")
    public Map<String, String> validateUserContacts(@RequestBody Map<String, String> map) {

        User user = userRepository.getOne(Long.valueOf(map.get("id")));

        if (!map.get("name").isEmpty())
            user.setName(map.get("name"));

        if (!map.get("surname").isEmpty())
            user.setSurname(map.get("surname"));

        if (!map.get("patronymic").isEmpty())
            user.setPatronymic(map.get("patronymic"));

        if (!map.get("email").isEmpty())
            user.setEmail(map.get("email"));

        if (!map.get("phone").isEmpty())
            user.setPhone(map.get("phone"));

        Set<ConstraintViolation<User>> constr = validator.validate(user);

        Map<String, String> validationMap = new HashMap<>();

        for (ConstraintViolation<User> c : constr) {

            validationMap.put(c.getPropertyPath().toString(), c.getMessage());
        }

        return validationMap;
    }

    @PostMapping("/user/contacts")
    public void userContacts(@RequestBody Map<String, String> map) {

        User user = userRepository.getOne(Long.valueOf(map.get("id")));

        user.setEmail(map.get("email"));
        user.setName(map.get("name"));
        user.setSurname(map.get("surname"));
        user.setPatronymic(map.get("patronymic"));
        user.setPhone(map.get("phone"));

        userRepository.save(user);
    }

    @PostMapping("/user/validate/shipping")
    public Map<String, String> validateUserShipping(@RequestBody Map<String, String> map) {

        User user = userRepository.getOne(Long.valueOf(map.get("id")));

        if (!map.get("country").isEmpty())
            user.setCountry(countryRepository.findByName(map.get("country")));
        else
            user.setCountry(null);

        if (!map.get("region").isEmpty())
            user.setRegion(regionRepository.findByName(map.get("region")));
        else
            user.setRegion(null);

        if (!map.get("city").isEmpty())
            user.setCity(map.get("city"));

        if (!map.get("street").isEmpty())
            user.setStreet(map.get("street"));

        if (!map.get("house").isEmpty())
            user.setHouse(map.get("house"));

        if (!map.get("flat").isEmpty())
            user.setFlat(map.get("flat"));

        Set<ConstraintViolation<User>> constr = validator.validate(user);

        Map<String, String> validationMap = new HashMap<>();

        for (ConstraintViolation<User> c : constr) {

            validationMap.put(c.getPropertyPath().toString(), c.getMessage());
        }

        return validationMap;
    }

    @PostMapping("/user/shipping")
    public void userShipping(@RequestBody Map<String, String> map) {

        User user = userRepository.getOne(Long.valueOf(map.get("id")));

        user.setCountry(countryRepository.findByName(map.get("country")));
        user.setRegion(regionRepository.findByName(map.get("region")));
        user.setCity(map.get("city"));
        user.setStreet(map.get("street"));
        user.setHouse(map.get("house"));
        user.setFlat(map.get("flat"));

        userRepository.save(user);
    }

    @PostMapping("/basket")
    public void basket(
            HttpServletResponse response,
            @RequestBody Map<String, String> map) {

        if (Integer.parseInt(map.get("count")) < 0)
            map.put("count", "0");

        Cookie cookie = new Cookie("product" + map.get("id"), map.get("count"));

        if (cookie.getValue().equals("0")) {

            cookie.setMaxAge(0);
            cookie.setValue(null);
        }

        response.addCookie(cookie);
    }

    @PostMapping("/order/validate/contacts")
    public Map<String, String> validateOrderContacts(@RequestBody Map<String, String> map) {

        Order order = new Order();

        if (!map.get("name").isEmpty())
            order.setName(map.get("name"));

        if (!map.get("surname").isEmpty())
            order.setSurname(map.get("surname"));

        if (!map.get("patronymic").isEmpty())
            order.setPatronymic(map.get("patronymic"));

        if (!map.get("phone").isEmpty())
            order.setPhone(map.get("phone"));

        Set<ConstraintViolation<Order>> constr = validator.validate(order);

        Map<String, String> validationMap = new HashMap<>();

        if (!map.get("email").isEmpty()) {

            if (map.get("password").isEmpty() &&
                    map.get("password1").isEmpty()) {

                validationMap.put("password", "Задайте пароль");

            } else {

                if (!map.get("password").equals(map.get("password1"))) {

                    validationMap.put("password", "Пароли должны сопадать");

                } else {

                    User user = userRepository.findByEmailAndPassword(map.get("email"), map.get("password"));

                    if (user == null)
                        validationMap.put("user", "Неправильная почта или пароль");
                }
            }
        }

        for (ConstraintViolation<Order> c : constr) {

            validationMap.put(c.getPropertyPath().toString(), c.getMessage());
        }

        return validationMap;
    }

    @PostMapping("/order/validate/shipping")
    public Map<String, String> validateOrderShipping(@RequestBody Map<String, String> map) {

        Order order = new Order();

        if (!map.get("region").isEmpty())
            order.setRegion(regionRepository.findByName(map.get("region")));

        if (!map.get("city").isEmpty())
            order.setCity(map.get("city"));

        if (!map.get("street").isEmpty())
            order.setStreet(map.get("street"));

        if (!map.get("house").isEmpty())
            order.setHouse(map.get("house"));

        if (!map.get("flat").isEmpty())
            order.setFlat(map.get("flat"));

        Set<ConstraintViolation<Order>> constr = validator.validate(order);

        Map<String, String> validationMap = new HashMap<>();

        for (ConstraintViolation<Order> c : constr) {

            validationMap.put(c.getPropertyPath().toString(), c.getMessage());
        }

        return validationMap;
    }

    @PostMapping("/order")
    public Long order(@RequestBody Map<String, String> map) {

        Order order = new Order();

        if (!map.get("email").isEmpty()) {

            User user = userRepository.findByEmail(map.get("email"));

            order.setUser(user);
        }

        order.setStatus(statusRepository.getOne(1L));
        order.setName(map.get("name"));
        order.setSurname(map.get("surname"));
        order.setPatronymic(map.get("patronymic"));
        order.setPhone(map.get("phone"));
        order.setRegion(regionRepository.findByName(map.get("region")));
        order.setCity(map.get("city"));
        order.setStreet(map.get("street"));
        order.setHouse(map.get("house"));
        order.setFlat(map.get("flat"));

        orderRepository.save(order);

        map.forEach((k, v) -> {

            if (k.startsWith("product")) {

                Long id = Long.valueOf(k.split("product")[1]);
                Integer count = Integer.valueOf(v);

                Product product = productRepository.getOne(id);

                OrderProduct orderProduct = new OrderProduct();

                orderProduct.setName(product.getName());
                orderProduct.setPrice(product.getPrice());
                orderProduct.setProduct(product);

                orderProductRepository.save(orderProduct);

                OrderContent orderContent = new OrderContent();

                orderContent.setOrder(order);
                orderContent.setOrderProduct(orderProduct);
                orderContent.setCount(count);

                orderContentRepository.save(orderContent);
            }
        });

        return order.getId();
    }

    @PostMapping("new-password")
    public String validatePassword(@RequestBody Map<String, String> map) {

        User user = userRepository.getOne(Long.valueOf(map.get("id")));

        if (map.get("prev").isEmpty())
            return "empty prev";

        if (!map.get("prev").equals(user.getPassword()))
            return "prev";

        if (map.get("next").isEmpty() && map.get("again").isEmpty())
            return "empty next";

        if (!map.get("next").equals(map.get("again")))
            return "next";

        user.setPassword(map.get("next"));
        userRepository.save(user);

        return "";
    }

    @PostMapping("comment")
    public void comment(@RequestBody Map<String, String> map) {

        if(!map.get("text").isEmpty()) {

            User user = userRepository.getOne(Long.valueOf(map.get("user")));
            Product product = productRepository.getOne(Long.valueOf(map.get("product")));

            Comment comment = new Comment();

            comment.setUser(user);
            comment.setProduct(product);
            comment.setText(map.get("text"));

            commentRepository.save(comment);
        }
    }
}
