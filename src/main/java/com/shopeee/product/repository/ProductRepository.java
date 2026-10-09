package com.shopeee.product.repository;

import com.shopeee.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           " LOWER(p.brand) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Product> search(@Param("q") String q, Pageable pageable);

    List<Product> findByFlashSaleTrueAndActiveTrueOrderBySoldDesc();

    List<Product> findByFeaturedTrueAndActiveTrueOrderBySoldDesc();

    Page<Product> findByActiveTrueAndCategoryId(Long categoryId, Pageable pageable);
}
