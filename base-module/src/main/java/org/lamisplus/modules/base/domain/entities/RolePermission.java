package org.lamisplus.modules.base.domain.entities;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@Table(name = "base_role_permission")
@IdClass(RolePermissionPK.class)
public class RolePermission implements Serializable {

    @Column(name = "role_id")
    @Id
    private Long roleId;

    @Column(name = "permission_id")
    @Id
    private Long permissionId;

    /*@EmbeddedId
    RolePermissionPK rolePermissionPK;*/
}
