package org.lamisplus.modules.base.domain.entities;

import lombok.Data;
import org.lamisplus.modules.base.domain.entities.JsonBEntity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Table(name = "base_module_access")
@Entity
@Data
public class ModuleAccess extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;
    @OneToMany
    private Set<Permission> authorities = new HashSet<>();
}
