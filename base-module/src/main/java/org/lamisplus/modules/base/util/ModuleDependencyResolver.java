package org.lamisplus.modules.base.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.configurer.ContextProvider;
import org.lamisplus.modules.base.domain.entities.ModuleDependency;
import org.lamisplus.modules.base.domain.entities.Module;
import org.lamisplus.modules.base.domain.repositories.ModuleDependencyRepository;
import org.springframework.stereotype.Component;

import java.util.Iterator;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Component
public class ModuleDependencyResolver {
    //private static ModuleDependencyRepository repository = ContextProvider.getBean(ModuleDependencyRepository.class);
    private final ModuleDependencyRepository moduleDependencyRepository;

    private static boolean versionSatisfied(ModuleDependency moduleDependency) {
        String requiredVersion = moduleDependency.getVersion();
        String installedVersion = moduleDependency.getDependency().getVersion();
        if (requiredVersion == null || installedVersion == null) {
            return true;
        }
        String requiredMajor = requiredVersion.split("\\.")[0];
        String installedMajor = installedVersion.split("\\.")[0];

        return requiredMajor.equals(installedMajor);
    }

    public void resolveDependencies(Module module, List<Module> resolved, List<Module> unresolved) throws CyclicDependencyException, UnsatisfiedDependencyException {
        unresolved.add(module);
        Iterator dependencyIterator = moduleDependencyRepository.findDependencies(module).iterator();
        while (dependencyIterator.hasNext()) {
            ModuleDependency moduleDependency = (ModuleDependency) dependencyIterator.next();
            Module dependency = moduleDependency.getDependency();
            if (!versionSatisfied(moduleDependency)) {
                throw new UnsatisfiedDependencyException(String.format("%s version requirements cannot be satisfied for module %s: requires %s but %s installed", dependency.getName(), module.getName(), module.getVersion(), dependency.getVersion()));
            }

            if (!resolved.contains(dependency)) {
                if (unresolved.contains(dependency)) {
                    throw new CyclicDependencyException(String.format("Circular reference detected: %s -> %s", module.getName(), dependency.getName()));
                }

                resolveDependencies(dependency, resolved, unresolved);
            }
        }
    }

    /*public static void resolveDependencies(Module module, List<Module> resolved, List<Module> unresolved)
            throws CyclicDependencyException, UnsatisfiedDependencyException {
        unresolved.add(module);
        for (ModuleDependency moduleDependency : repository.findDependencies(module)) {
            Module dependency = moduleDependency.getDependency();
            if (!versionSatisfied(moduleDependency)) {
                throw new UnsatisfiedDependencyException(
                        String.format("%s version requirements cannot be satisfied for module %s: " +
                                        "requires %s but %s installed", dependency.getName(), module.getName(),
                                module.getVersion(), dependency.getVersion()));
            }
            if (!resolved.contains(dependency)) {
                if (unresolved.contains(dependency)) {
                    throw new CyclicDependencyException(
                            String.format("Circular reference detected: %s -> %s", module.getName(), dependency.getName()));
                }
                resolveDependencies(dependency, resolved, unresolved);
            }
        }
        resolved.add(module);
        unresolved.remove(module);
    }*/
}
