package com.intelligence.criminalnetwork.repository;

import com.intelligence.criminalnetwork.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByVehicleId(String vehicleId);
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    List<Vehicle> findByOwnerPersonId(Long ownerPersonId);
    List<Vehicle> findByCaseId(Long caseId);
}
