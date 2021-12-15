package com.jilnash.controller;

import com.jilnash.model.*;
import com.jilnash.repository.*;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    Validator validator;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    GenerationRepository generationRepository;

    @Autowired
    ProductGenerationRepository productGenerationRepository;

    @Autowired
    StockRepository stockRepository;

    @Autowired
    InstockRepository instockRepository;

    @GetMapping("/all")
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

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {

        if(id == -1)
            return new Product();

        return productRepository.findById(id).get();
    }

    @PostMapping("/{id}/img")
    public void setImgs(@PathVariable Long id, @RequestParam Map<String, MultipartFile> fd) throws IOException {

        String dir = System.getProperty("user.dir") + "\\src\\main\\resources\\static\\img\\product-" + id + "\\";

        File directory = new File(dir);

        if(directory.exists())
            FileUtils.cleanDirectory(directory);
        else
            directory.mkdir();

        fd.forEach((k, v) -> {

            String type = v.getOriginalFilename().split("\\.")[1];

            try {

                v.transferTo(new File(dir + k + "." + type));

            } catch (IOException e) {

                e.printStackTrace();
            }
        });
    }

    @GetMapping("/{id}/brands")
    public Set<Brand> getBrands(@PathVariable Long id) {

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

    @GetMapping("/{id}/count")
    public Integer getCount(@PathVariable(name = "id") Long id) {

        Product product = productRepository.getOne(id);

        Integer count = 0;

        for(Instock i: product.getInstocks())
            count +=i.getCount();

        return count;
    }

    @PostMapping("{id}/comment")
    public void comment(@PathVariable Long id, @RequestBody Map<String, String> map) {

        if(!map.get("text").isEmpty()) {

            User user = userRepository.getOne(Long.valueOf(map.get("user")));
            Product product = productRepository.getOne(id);

            Comment comment = new Comment();

            comment.setUser(user);
            comment.setProduct(product);
            comment.setText(map.get("text"));

            commentRepository.save(comment);
        }
    }

    @PostMapping("/validate")
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

    @PostMapping("/save")
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
}
