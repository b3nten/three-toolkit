/*
	Lifecycle:

	Actor: onCreate -> onSpawn -> onUpdate -> onDespawn -> onDestroy
	Component: onCreate -> onAddedToActor -> onSpawn -> onUpdate -> onDespawn -> onRemovedFromActor -> onDestroy

	Scene->load()
		Scene->loadAssets()
	Scene->play()
		Actor->onCreate()
			Component->onCreate()
			Component->onAddedToActor()
		Actor->onSpawn()
			Component->onSpawn()
		Actor->onUpdate()
			Component->onUpdate()
		Actor->onPostUpdate()
			Component->onPostUpdate()
		Actor->onDespawn()
			Component->onDespawn()
		Actor->onDestroy()
			Component->onRemovedFromActor()
			Component->onDespawn()
			Component->onDestroy()
	Scene->endPlay()
		Actor->onDespawn()
			Component->onDespawn()
		Actor->onDestroy()
			Component->onDestroy()
*/

