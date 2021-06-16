package com.jilnash;


import com.jilnash.model.*;
import com.jilnash.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.text.ParseException;
import java.text.SimpleDateFormat;
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

    @Autowired
    InstockRepository instockRepository;

    @Autowired
    TypeRepository typeRepository;

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

        if(brand != null) {

            for(Product p: products) {

                boolean containes = false;

                for(ProductGeneration pg: p.getProductGenerations())
                    if(pg.getGeneration().getModel().getBrand().getName().equals(brand)) {
                        containes = true;
                        break;
                    }

                if(!containes)
                    wrong.add(p);
                else {

                     if(model != null) {

                         containes = false;

                         for(ProductGeneration pg: p.getProductGenerations())
                             if(pg.getGeneration().getModel().getName().equals(model)) {
                                 containes = true;
                                 break;
                             }

                         if(!containes)
                             wrong.add(p);
                         else {

                             if(generation != null) {

                                 containes = false;

                                 for(ProductGeneration pg: p.getProductGenerations())
                                     if(pg.getGeneration().getName().equals(generation)) {
                                         containes = true;
                                         break;
                                     }

                                 if(!containes)
                                     wrong.add(p);
                             }
                         }
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

        if(id == -1)
            return new Product();

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

        product.setCategory(categoryRepository.getOne(Long.valueOf(map.get("category"))));
        product.setName(map.get("name"));
        product.setArticle(map.get("article"));
        product.setManufacturer(map.get("manufacturer"));
        product.setDescription(map.get("description"));
        product.setPrice(Double.valueOf(map.get("price")));

        productRepository.save(product);

        if(map.get("id") != null)
            productGenerationRepository.deleteProductGenerationByProduct(product);

        for(String id: map.get("generations").split(" ")) {

            ProductGeneration pg = new ProductGeneration();

            pg.setGeneration(generationRepository.getOne(Long.valueOf(id)));
            pg.setProduct(product);

            productGenerationRepository.save(pg);
        }

        instockRepository.deleteInstocksByProduct(product);

        for(String instock: map.get("stocks").split(",")) {

            Instock is = new Instock();

            is.setProduct(product);
            is.setStock(stockRepository.getOne(Long.valueOf(instock.split(":")[0])));
            is.setCount(Integer.valueOf(instock.split(":")[1]));

            instockRepository.save(is);
        }
    }

    @GetMapping("/products/{id}/brands")
    public Set<Brand> getProductBrands(@PathVariable Long id) {

        Product p = productRepository.getOne(id);

        Set<Brand> brands = new LinkedHashSet<>();
        Set<Model> models = new LinkedHashSet<>();
        Set<Generation> generations = new LinkedHashSet<>();

        for(ProductGeneration pg: p.getProductGenerations()) {

            brands.add(pg.getGeneration().getModel().getBrand());
            models.add(pg.getGeneration().getModel());
            generations.add(pg.getGeneration());
        }

        for(Brand b: brands) {

            List<Model> brandModels = new LinkedList<>();

            for(Model mg: b.getModels()) {

                List<Generation> modelGenerations = new LinkedList<>();

                for(Generation g: mg.getGenerations())
                    if(generations.contains(g))
                        modelGenerations.add(g);

                mg.setGenerations(modelGenerations);

                for(Model m: models)
                    if(m.equals(mg))
                        brandModels.add(m);
            }

            b.setModels(brandModels);
        }

        return brands;
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
                if(!o.getPhone().startsWith(phone))
                    wrong.add(o);
            });

        List<Order> result = new LinkedList<>();

        orders.forEach(o -> {
            if(!wrong.contains(o))
                result.add(o);
        });

        return result;
    }

    @GetMapping("/orders/{id}/price")
    public Double getOrderPrice(@PathVariable Long id) {

        double price = 0;

        for(OrderContent oc: orderRepository.getOne(id).getOrderContents())
            price += oc.getOrderProduct().getPrice() * oc.getCount();

        return price;
    }

    @GetMapping("/statuses")
    public List<Status> getStatuses() {

        return statusRepository.findAll();
    }

    @GetMapping("/products/{id}/count")
    public Integer getCount(@PathVariable(name = "id") Long id) {

        Product product = productRepository.getOne(id);

        Integer count = 0;

        for(Instock i: product.getInstocks())
            count +=i.getCount();

        return count;
    }

    @PostMapping("/param")
    public void saveParam(@RequestParam(name = "param") String param,
                          @RequestParam(name = "name") String name,
                          @RequestParam(name = "id") Long id,
                          @RequestParam(name = "parent", required = false) Long parent) {

        if(param.equals("category")) {

            Category c = null;

            if (id != -1)
                c = categoryRepository.getOne(id);
            else
                c = new Category();

            c.setName(name);
            c.setDeleted(false);
            categoryRepository.save(c);
        }

        if(param.equals("brand")) {

            Brand b = null;

            if (id != -1)
                b = brandRepository.getOne(id);
            else
                b = new Brand();

            b.setName(name);
            brandRepository.save(b);
        }

        if(param.equals("model")) {

            Model m = null;

            if (id != -1)
                m = modelRepository.getOne(id);
            else
                m = new Model();

            m.setName(name);
            m.setBrand(brandRepository.getOne(parent));
            modelRepository.save(m);
        }

        if(param.equals("generation")) {

            Generation g = null;

            if (id != -1)
                g = generationRepository.getOne(id);
            else
                g = new Generation();

            g.setName(name);
            g.setModel(modelRepository.getOne(parent));
            generationRepository.save(g);
        }

        if(param.equals("type")) {

            Type t = null;

            if (id != -1)
                t = typeRepository.getOne(id);
            else
                t = new Type();

            t.setName(name);
            t.setGeneration(generationRepository.getOne(parent));
            typeRepository.save(t);
        }

        if(param.equals("stock")) {

            Stock s = null;

            if (id != -1)
                s = stockRepository.getOne(id);
            else
                s = new Stock();

            s.setName(name);
            stockRepository.save(s);
        }

        if(param.equals("country")) {

            Country c = null;

            if (id != -1)
                c = countryRepository.getOne(id);
            else
                c = new Country();

            c.setName(name);
            countryRepository.save(c);
        }

        if(param.equals("region")) {

            Region r = null;

            if (id != -1)
                r = regionRepository.getOne(id);
            else
                r = new Region();

            r.setName(name);
            r.setCountry(countryRepository.getOne(parent));
            regionRepository.save(r);
        }
    }

    @GetMapping("/stocks")
    public List<Stock> getStocks() {

        return stockRepository.findAll();
    }

    @PostMapping("/stock/delete")
    public void deleteStock(@RequestParam(name = "id") Long id) {

        Stock s = stockRepository.getOne(id);

        instockRepository.deleteInstocksByStock(s);
        stockRepository.delete(s);
    }

    @GetMapping("/categories")
    public List<Category> getCategories() {

        return categoryRepository.findAll();
    }

    @PostMapping("/category/delete")
    public void deleteCategory(@RequestParam(name = "id") Long id) {

        Category c = categoryRepository.getOne(id);
        c.setDeleted(true);
        categoryRepository.save(c);
    }

    @GetMapping("/brands")
    public List<Brand> getBrands() {

        return brandRepository.findAll();
    }

    @PostMapping("/brand/delete")
    public void deleteBrand(@RequestParam(name = "id") Long id) {

        Brand b = brandRepository.getOne(id);

        b.getModels().forEach(m -> {

            m.getGenerations().forEach(g -> {

                productGenerationRepository.deleteProductGenerationByGeneration(g);
                generationRepository.delete(g);
            });

            modelRepository.delete(m);
        });

        brandRepository.delete(b);
    }

    @GetMapping("/models")
    public List<Model> getModels(@RequestParam(name = "brand", required = false) String brand) {

        if(brand != null)
            return modelRepository.findAllByBrand(brandRepository.findByName(brand));

        return modelRepository.findAll();
    }

    @PostMapping("/model/delete")
    public void deleteModel(@RequestParam(name = "id") Long id) {

        Model m = modelRepository.getOne(id);

        m.getGenerations().forEach(g -> {

            productGenerationRepository.deleteProductGenerationByGeneration(g);
            generationRepository.delete(g);
        });

        modelRepository.delete(m);
    }

    @GetMapping("/generations")
    public List<Generation> getGenerations(@RequestParam(name = "model", required = false) String model) {

        if(model != null)
            return generationRepository.findAllByModel(modelRepository.findByName(model));

        return generationRepository.findAll();
    }

    @PostMapping("/generation/delete")
    public void deleteGeneration(@RequestParam(name = "id") Long id) {

        Generation g = generationRepository.getOne(id);

        productGenerationRepository.deleteProductGenerationByGeneration(g);
        generationRepository.delete(g);
    }

    @PostMapping("/type/delete")
    public void deleteType(@RequestParam(name = "id") Long id) {

        Type t = typeRepository.getOne(id);

        typeRepository.delete(t);
    }

    @GetMapping("/countries")
    public List<Country> getCountries() {

        return countryRepository.findAll();
    }

    @PostMapping("/country/delete")
    public void deleteCountry(@RequestParam(name = "id") Long id) {

        Country c = countryRepository.getOne(id);

        regionRepository.deleteAllByCountry(c);

        countryRepository.delete(c);
    }

    @GetMapping("/regions")
    public List<Region> getRegions(@RequestParam(name = "country", required = false) String name) {

        if(name == null)
            return regionRepository.findAll();

        return regionRepository.findAllByCountry(countryRepository.findByName(name));
    }

    @PostMapping("/region/delete")
    public void deleteRegion(@RequestParam(name = "id") Long id) {

        Region r = regionRepository.getOne(id);

        regionRepository.delete(r);
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

    @PostMapping("/order/status")
    public void setOrderStatus(@RequestParam(name = "order") Long order,
                               @RequestParam(name = "status") Long s) {

        Order o = orderRepository.getOne(order);
        o.setStatus(statusRepository.getOne(s));
        orderRepository.save(o);
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
