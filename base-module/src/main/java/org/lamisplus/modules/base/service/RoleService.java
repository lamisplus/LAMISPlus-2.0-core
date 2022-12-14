package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.RoleDTO;
import org.lamisplus.modules.base.domain.entities.*;
import org.lamisplus.modules.base.domain.repositories.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.*;

import static org.lamisplus.modules.base.util.Constants.ArchiveStatus.UN_ARCHIVED;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final RoleMenuRepository roleMenuRepository;
    private final MenuRepository menuRepository;


    /*@PersistenceContext
    EntityManager em;*/

    public void save(RoleDTO roleDTO) {
        Optional<Role> RoleOptional = roleRepository.findByName(roleDTO.getName());
        if (RoleOptional.isPresent()) throw new RecordExistException(Role.class, "Name", roleDTO.getName());

        Role role = new Role();
        role.setName(roleDTO.getName());
        HashSet<Permission> permissions = getPermissions(roleDTO.getPermissions());
        HashSet<Menu> menus = getMenusById(roleDTO.getMenus());

        role.setPermission(permissions);
        role.setMenu(menus);
        role.setArchived(UN_ARCHIVED);

        if(StringUtils.isBlank(role.getCode())) {
            role.setCode(UUID.randomUUID().toString());
        }
        Role savedRole =  roleRepository.save(role);
    }

    public Role get(Long id) {
        Optional<Role> roleOptional = this.roleRepository.findById(id);
        if (!roleOptional.isPresent()) throw new EntityNotFoundException(Role.class, "Id", id + "");
        return roleOptional.get();
    }

    public Role updateName(long id, String name) {
        Optional<Role> roleOptional = roleRepository.findById(id);
        if(!roleOptional.isPresent())throw new EntityNotFoundException(Role.class, "Id", id +"");
        Role updatedRole = roleOptional.get();
        updatedRole.setName(name);
        updatedRole.setArchived(UN_ARCHIVED);
        return roleRepository.save(updatedRole);
    }

    public Role updatePermissions(long id, List<Permission> permissions) {
        Optional<Role> roleOptional = roleRepository.findById(id);
        if(!roleOptional.isPresent())throw new EntityNotFoundException(Role.class, "Id", id +"");
        Role updatedRole = roleOptional.get();
        HashSet<Permission> permissionsSet = getPermissions(permissions);
        updatedRole.setPermission(permissionsSet);
        return roleRepository.save(updatedRole);
    }

    private HashSet<Permission> getPermissions(List<Permission> permissions) {
        HashSet permissionsSet = new HashSet<>();
        Permission permissionToAdd = new Permission();
        for(Permission p : permissions){
            try {
                // add permissions by either id or name
                if (null != p.getName()) {
                    permissionToAdd = permissionRepository.findByNameAndArchived(p.getName(), UN_ARCHIVED).get();
                }  else {
                    ResponseEntity.badRequest();
                    return null;
                }
                permissionsSet.add(permissionToAdd);
            }catch(Exception e){
                e.printStackTrace();
            }
        }
        return permissionsSet;
    }

    private HashSet<Menu> getMenusById(List<Menu> menus) {
        HashSet<Menu> menuList = new HashSet<>();
        menus.forEach(menu ->{
            Menu menu1 = menuRepository.findByIdAndArchived(menu.getId(), UN_ARCHIVED).orElse(new Menu());
            while(menu1 != null && menu1.getId() != null){
                menuList.add(menu1);
                menu1 = menu1.getParent();
            }
        });
        return menuList;
    }

    public Role updateMenus(Long id, List<Menu> menus) {
        Role updatedRole = roleRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException(Role.class, "Id", id +""));
        HashSet<Menu> menuHashSet = this.getMenusById(menus);
        updatedRole.setMenu(menuHashSet);
        return roleRepository.save(updatedRole);
    }
}
