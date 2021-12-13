package com.jilnash.controller;

import com.jilnash.model.Category;
import com.jilnash.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    CategoryRepository categoryRepository;

    @GetMapping("/all")
    public List<Category> getCategories() {

        return categoryRepository.findAll();
    }

    @PostMapping("/{id}/save")
    public void saveCategory(@PathVariable Long id,
                             @RequestParam(name = "name") String name) {

        Category c = null;

        if (id != -1)
            c = categoryRepository.getOne(id);
        else
            c = new Category();

        c.setName(name);
        c.setDeleted(false);
        categoryRepository.save(c);
    }

    @PostMapping("/{id}/delete")
    public void deleteCategory(@PathVariable Long id) {

        Category c = categoryRepository.getOne(id);
        c.setDeleted(true);
        categoryRepository.save(c);
    }
}
