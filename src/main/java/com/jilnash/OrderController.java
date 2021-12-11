package com.jilnash;

import com.jilnash.model.*;
import com.jilnash.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    Validator validator;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderContentRepository orderContentRepository;

    @Autowired
    OrderProductRepository orderProductRepository;

    @Autowired
    RegionRepository regionRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    StatusRepository statusRepository;

    @GetMapping("/all")
    public List<Order> getAll(@RequestParam(name = "id", required = false) Long id,
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

    @GetMapping("/{id}/price")
    public Double getPrice(@PathVariable Long id) {

        double price = 0;

        for(OrderContent oc: orderRepository.getOne(id).getOrderContents())
            price += oc.getOrderProduct().getPrice() * oc.getCount();

        return price;
    }

    @PostMapping("/validate/contacts")
    public Map<String, String> validateContacts(@RequestBody Map<String, String> map) {

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

    @PostMapping("/validate/shipping")
    public Map<String, String> validateShipping(@RequestBody Map<String, String> map) {

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

    @PostMapping("/save")
    public Long saveOrder(@RequestBody Map<String, String> map) {

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

    @PostMapping("{order}/status/{s}")
    public void setStatus(@PathVariable Long order,
                               @PathVariable Long s) {

        Order o = orderRepository.getOne(order);
        o.setStatus(statusRepository.getOne(s));
        orderRepository.save(o);
    }
}
