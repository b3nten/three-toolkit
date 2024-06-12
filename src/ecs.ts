// import * as three from 'three';

// export type Entity = Symbol & { isEntity: never };

// type Component<T = {}> = T & { COMPONENT_TYPE: string }

// const component = <T>(name: string) => (component: T): Component<T> => ({...component, COMPONENT_TYPE: name});

// export class World {

//     onCreateEntity?(entity: Entity): void
//     onDeleteEntity?(entity: Entity): void
//     onAddComponentToEntity?(entity: Entity, component: Component): void
//     onRemoveComponentFromEntity?(entity: Entity, component: Component): void

//     components = new Map<string, Map<Entity, Component>>;

//     createEntity(): Entity {
//         const entity = Symbol() as unknown as Entity;
//         this.onCreateEntity?.(entity);
//         return entity;
//     }

//     deleteEntity(entity: Entity){
//         this.onDeleteEntity?.(entity);
//         for(const component of this.components.values()){
//             component.delete(entity);
//         }
//     }

//     addComponentToEntity(entity: Entity, component: Component): Component {
//         this.onAddComponentToEntity?.(entity, component);
//         const componentMap = this.components.get(component.COMPONENT_TYPE) ?? new Map<Entity, Component>();
//         componentMap.set(entity, component);
//         this.components.set(component.COMPONENT_TYPE, componentMap);
//         return component;
//     }

//     removeComponentFromEntity(entity: Entity, componentType: string): Component | undefined {

//     }

//     createPrefab<T extends Component>(components: T[]): Entity {
//         const entity = this.createEntity();
//         for(const component of components){
//             this.addComponentToEntity(entity, component);
//         }
//         return entity;
//     }

// }

// export class ThreeWorld extends World {

//     root = new three.Scene;

//     onCreateEntity(entity: Entity){

//     }

// }
