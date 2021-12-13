package com.jilnash.controller;

import com.jilnash.model.User;
import com.jilnash.repository.CountryRepository;
import com.jilnash.repository.RegionRepository;
import com.jilnash.repository.RoleRepository;
import com.jilnash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    Validator validator;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    CountryRepository countryRepository;

    @Autowired
    RegionRepository regionRepository;

    @PostMapping("/{id}")
    public User getUser(@PathVariable Long id) {

        return userRepository.findById(id).get();
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

    @PostMapping("/validate")
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

    @PostMapping("/new-password")
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

    @PostMapping("/validate/contacts")
    public Map<String, String> validateContacts(@RequestBody Map<String, String> map) {

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
            System.out.println(c.getPropertyPath().toString());
            System.out.println(c.getMessage());
        }

        return validationMap;
    }

    @PostMapping("/contacts")
    public void saveContacts(@RequestBody Map<String, String> map) {

        User user = userRepository.getOne(Long.valueOf(map.get("id")));

        user.setEmail(map.get("email"));
        user.setName(map.get("name"));
        user.setSurname(map.get("surname"));
        user.setPatronymic(map.get("patronymic"));
        user.setPhone(map.get("phone"));

        userRepository.save(user);
    }

    @PostMapping("/validate/shipping")
    public Map<String, String> validateShipping(@RequestBody Map<String, String> map) {

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

    @PostMapping("/shipping")
    public void saveShipping(@RequestBody Map<String, String> map) {

        User user = userRepository.getOne(Long.valueOf(map.get("id")));

        user.setCountry(countryRepository.findByName(map.get("country")));
        user.setRegion(regionRepository.findByName(map.get("region")));
        user.setCity(map.get("city"));
        user.setStreet(map.get("street"));
        user.setHouse(map.get("house"));
        user.setFlat(map.get("flat"));

        userRepository.save(user);
    }
}
