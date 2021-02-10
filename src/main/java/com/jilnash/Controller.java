package com.jilnash;


import com.jilnash.model.*;
import com.jilnash.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
    ProductBrandRepository productBrandRepository;

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderContentRepository orderContentRepository;

    @Autowired
    OrderProductRepository orderProductRepository;

    @GetMapping("/products")
    public List<Product> getProducts(
            @RequestParam(name = "page") String page,
            @RequestParam(name = "pattern", required = false) String pattern,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "brand", required = false) String brand,
            @RequestParam(name = "model", required = false) String model,
            @RequestParam(name = "generation", required = false) String generation,
            @RequestParam(name = "instock", required = false) String instock) {

        List<Product> result = productRepository.findAll();

        if (pattern != null) {

            result.removeIf(
                    product -> !product.getName().contains(pattern)
                            && !product.getArticle().contains(pattern)
            );
        }

        if (category != null) {

            result.removeIf(
                    product -> !product.getCategory().getName().equals(category)
            );
        }

        if (brand != null) {

            for (Product p : result) {

                for (ProductBrand pb : p.getProductBrands()) {

                    if (!pb.getBrand().getName().equals(brand)) {

                        result.remove(p);
                    } else {

                        if (model != null) {

                            for (Model m : pb.getBrand().getModels()) {

                                if (!m.getName().equals(model)) {

                                    result.remove(p);
                                } else {

                                    if (generation != null) {

                                        for (Generation g : m.getGenerations()) {

                                            if (!g.getName().equals(generation)) {

                                                result.remove(p);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if (instock != null) {

            for (Product p : result) {

                int count = 0;

                for (Instock i : p.getInstocks())
                    count += i.getCount();

                if (count == 0)
                    result.remove(p);
            }
        }

        return result;
    }

    @GetMapping("/products/{id}")
    public Product getProduct(@PathVariable Long id) {

        return productRepository.findById(id).get();
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
    public List<Generation> getGenerations(@RequestParam(name = "model") String model) {

        return generationRepository.findAllByModel(
                modelRepository.findByName(model)
        );
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

    @PostMapping("/validate-user")
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

    @PostMapping("/validate-user-contacts")
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

    @PostMapping("/user-contacts")
    public void userContacts(@RequestBody Map<String, String> map) {

        User user = userRepository.getOne(Long.valueOf(map.get("id")));

        user.setEmail(map.get("email"));
        user.setName(map.get("name"));
        user.setSurname(map.get("surname"));
        user.setPatronymic(map.get("patronymic"));
        user.setPhone(map.get("phone"));

        userRepository.save(user);
    }

    @PostMapping("/validate-user-shipping")
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

    @PostMapping("/user-shipping")
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

        if(cookie.getValue().equals("0")) {

            cookie.setMaxAge(0);
            cookie.setValue(null);
        }

        response.addCookie(cookie);
    }

    @PostMapping("/validate-order-contacts")
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

    @PostMapping("/validate-order-shipping")
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

        order.setStatus("created");
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

        if(map.get("prev").isEmpty())
            return "empty prev";

        if(!map.get("prev").equals(user.getPassword()))
            return "prev";

        if(map.get("next").isEmpty() && map.get("again").isEmpty())
            return "empty next";

        if(!map.get("next").equals(map.get("again")))
            return "next";

        user.setPassword(map.get("next"));
        userRepository.save(user);

        return "";
    }
}
