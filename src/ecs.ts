import { SparseSet } from "./dsa"
import * as three from "three"

type ConstructorOf<T, Args extends any[] = any[]> = new (
  ...args: Args
) => T;

/****************************************************************************************
 * Entity
 *****************************************************************************************/

export type Entity = number & { isEntity: never };

/****************************************************************************************
 * Components
 *****************************************************************************************/

export type ComponentType = string & {};

export type Component<T = {}> = T & { ComponentType: ComponentType };

export type ComponentDefinition<T> = {
  (args: T): Component<T>;
  ComponentType: ComponentType;
};

export function ComponentDef<
  T extends { ComponentType?: never } & Record<string, any>,
>(componentType: ComponentType): ComponentDefinition<T> {
  const componentConstructor = (component: T) => ({
    ...component,
    ComponentType: componentType,
  });
  componentConstructor.ComponentType = componentType;
  return componentConstructor;
}

export function resolveComponentType(component: Component | ComponentType): ComponentType {
  return typeof component === "string" ? component : component.ComponentType;
}

/****************************************************************************************
 * Prefabs
 *****************************************************************************************/

export type Prefab<Args extends Array<any>, T extends Array<Component>> = {
  PrefabType: string;
  create: (...args: Args) => Readonly<T> & { PrefabType: string };
};

type PrefabType = string & {};

export function PrefabDef<Args extends Array<any>, T extends Array<Component>>(
  type: PrefabType,
  create: (...args: Args) => Readonly<T>,
): Prefab<Args, T> {
  return {
    PrefabType: type,
    create: (...args: Args) => {
      const components = create(...args) as T & { PrefabType?: string };
      components.PrefabType = type;
      return components as Readonly<T> & { PrefabType: string };
    },
  };
}

/****************************************************************************************
 * Systems
 *****************************************************************************************/

export abstract class System {
  world: World = worldContext.get();

  enabled?: boolean;

  onCreateEntity?(entity: Entity): void;
  onDeleteEntity?(entity: Entity): void;
  onAddComponentToEntity?(entity: Entity, component: Component): void;
  onRemoveComponentFromEntity?(entity: Entity, component: Component): void;

  onUpdate?(delta: number, elapsed: number): void;
}

/****************************************************************************************
 * World
 *****************************************************************************************/

const worldContext = {
  worldContext: [] as World[],
  get(): World {
    const w = this.worldContext[this.worldContext.length - 1];
    if (!w) {
      throw new Error(
        "No world context available. If you encounter this error, you are probably trying to create a system manually.",
      );
    }
    return w;
  },
  run<T>(world: World, fn: () => T): T | undefined {
    this.worldContext.push(world);
    try {
      const result = fn();
      return result;
    } catch (error) {
      console.error(error);
    } finally {
      this.worldContext.pop();
    }
  },
};

export class Query {
  mustContain = new Set<ComponentType | Component<unknown>>();
  cannotContain = new Set<ComponentType | Component<unknown>>();
  someContain = new Set<ComponentType | Component<unknown>>();

  contains(componentType: ComponentType | Component<unknown>): Query {
    this.mustContain.add(componentType);
    return this;
  }

  none(componentType: ComponentType | Component<unknown>): Query {
    this.cannotContain.add(componentType);
    return this;
  }

  some(...componentTypes: Array<ComponentType | Component<unknown>>): Query {
    for(const componentType of componentTypes) {
      if(!this.mustContain.has(componentType) && !this.cannotContain.has(componentType)) {
        this.someContain.add(componentType);
      }
    }
    return this;
  }
}

export class World {
  components = new Map<ComponentType, SparseSet<Component>>();
  systems = new Set<System>();

  // Store callbacks for systems, to reduce iteration over all systems
  onCreateEntityCallbacks = new Set<(entity: Entity) => void>();
  onDeleteEntityCallbacks = new Set<(entity: Entity) => void>();
  onAddComponentToEntityCallbacks = new Set<
    (entity: Entity, component: Component) => void
  >();
  onRemoveComponentFromEntityCallbacks = new Set<
    (entity: Entity, component: Component) => void
  >();
  onUpdateCallbacks = new Set<(delta: number, elapsed: number) => void>();

  createEntity(name?: string): Entity {
    const entity = Symbol() as unknown as Entity;
    for (const callback of this.onCreateEntityCallbacks) {
      callback(entity);
    }
    return entity;
  }

  deleteEntity(entity: Entity) {
    for (const callback of this.onDeleteEntityCallbacks) {
      callback(entity);
    }
    for (const component of this.components.values()) {
      component.delete(entity);
    }
  }

  addComponentToEntity(entity: Entity, component: Component): Component {
    for (const callback of this.onAddComponentToEntityCallbacks) {
      callback(entity, component);
    }
    const componentType = component.ComponentType;
    let componentMap = this.components.get(componentType);
    if (!componentMap) {
      componentMap = new SparseSet();
      this.components.set(componentType, componentMap);
    }
    componentMap.add(entity, component);
    return component;
  }

  removeComponentFromEntity(
    entity: Entity,
    componentType: string,
  ): Component | undefined {
    const componentMap = this.components.get(componentType);
    if (componentMap) {
      const component = componentMap.get(entity);
      if (component) {
        for (const callback of this.onRemoveComponentFromEntityCallbacks) {
          callback(entity, component);
        }
        componentMap.delete(entity);
        return component;
      }
    }
    return undefined;
  }

  addSystem<Sys extends System, Args extends any[]>(
    system: ConstructorOf<Sys, Args>,
    ...args: Args
  ) {
    worldContext.run(this, () => {
      const instance = new system(...args);
      this.systems.add(instance);
      instance.enabled = true;
      if (instance.onUpdate) {
        this.onUpdateCallbacks.add(instance.onUpdate);
      }
      if (instance.onCreateEntity) {
        this.onCreateEntityCallbacks.add(instance.onCreateEntity);
      }
      if (instance.onDeleteEntity) {
        this.onDeleteEntityCallbacks.add(instance.onDeleteEntity);
      }
      if (instance.onAddComponentToEntity) {
        this.onAddComponentToEntityCallbacks.add(
          instance.onAddComponentToEntity,
        );
      }
      if (instance.onRemoveComponentFromEntity) {
        this.onRemoveComponentFromEntityCallbacks.add(
          instance.onRemoveComponentFromEntity,
        );
      }
    });
  }

  disableSystem(system: System) {
    system.enabled = false;
    if (system.onUpdate) {
      this.onUpdateCallbacks.delete(system.onUpdate);
    }
    if (system.onCreateEntity) {
      this.onCreateEntityCallbacks.delete(system.onCreateEntity);
    }
    if (system.onDeleteEntity) {
      this.onDeleteEntityCallbacks.delete(system.onDeleteEntity);
    }
    if (system.onAddComponentToEntity) {
      this.onAddComponentToEntityCallbacks.delete(
        system.onAddComponentToEntity,
      );
    }
    if (system.onRemoveComponentFromEntity) {
      this.onRemoveComponentFromEntityCallbacks.delete(
        system.onRemoveComponentFromEntity,
      );
    }
  }

  enableSystem(system: System) {
    system.enabled = true;
    if (system.onUpdate) {
      this.onUpdateCallbacks.add(system.onUpdate);
    }
    if (system.onCreateEntity) {
      this.onCreateEntityCallbacks.add(system.onCreateEntity);
    }
    if (system.onDeleteEntity) {
      this.onDeleteEntityCallbacks.add(system.onDeleteEntity);
    }
    if (system.onAddComponentToEntity) {
      this.onAddComponentToEntityCallbacks.add(system.onAddComponentToEntity);
    }
    if (system.onRemoveComponentFromEntity) {
      this.onRemoveComponentFromEntityCallbacks.add(
        system.onRemoveComponentFromEntity,
      );
    }
  }

  query(query: Query) {
    const entities = new Set<Entity>();
    
  }
}

export const ActiveCameraTag = ComponentDef("activeCamera")

export const PerspectiveCamera = ComponentDef<{
  aspect: number;
  fov: number;
  near: number;
  far: number;
  zoom: number;
}>("perspectiveCamera")

export const OrthographicCamera = ComponentDef<{
  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;
  zoom: number;
}>("orthographicCamera")

class ThreeIntegrationSystem extends System {
  declare world: World;
  declare enabled?: boolean | undefined;

  public scene = new three.Scene;
  public renderer = new three.WebGLRenderer;

  onCreateEntity(entity: Entity): void {
    
  }

  onDeleteEntity(entity: Entity): void {
    
  }

  onAddComponentToEntity(entity: Entity, component: Component): void {
    
  }

  onRemoveComponentFromEntity(entity: Entity, component: Component): void {
    
  }

  cameraQuery = new Query().contains(ActiveCameraTag).some(PerspectiveCamera, OrthographicCamera)

  onUpdate(delta: number, elapsed: number): void {
    const cameraQuery = this.world.query(this.cameraQuery)
  }
}