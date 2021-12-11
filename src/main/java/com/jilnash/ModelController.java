package com.jilnash;

import com.jilnash.model.Model;
import com.jilnash.repository.BrandRepository;
import com.jilnash.repository.GenerationRepository;
import com.jilnash.repository.ModelRepository;
import com.jilnash.repository.ProductGenerationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/model")
public class ModelController {

    @Autowired
    BrandRepository brandRepository;

    @Autowired
    ModelRepository modelRepository;

    @Autowired
    GenerationRepository generationRepository;

    @Autowired
    ProductGenerationRepository productGenerationRepository;

    @GetMapping("/all")
    public List<Model> getModels(@RequestParam(name = "brand", required = false) String brand) {

        if(brand != null)
            return modelRepository.findAllByBrand(brandRepository.findByName(brand));

        return modelRepository.findAll();
    }

    @PostMapping("/{id}/save")
    public void saveModel(@PathVariable Long id,
                          @RequestParam(name = "name") String name,
                          @RequestParam(name = "parent", required = false) Long parent) {

        Model m = null;

        if (id != -1)
            m = modelRepository.getOne(id);
        else
            m = new Model();

        m.setName(name);
        m.setBrand(brandRepository.getOne(parent));
        modelRepository.save(m);
    }

    @PostMapping("/{id}/delete")
    public void deleteModel(@PathVariable Long id) {

        Model m = modelRepository.getOne(id);

        m.getGenerations().forEach(g -> {

            productGenerationRepository.deleteProductGenerationByGeneration(g);
            generationRepository.delete(g);
        });

        modelRepository.delete(m);
    }
}
