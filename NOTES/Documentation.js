////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

App (app.js)
------------
Config -> growlProvider, BackandProvider
State -> home

AppController
--------------
Dependency -> $scope, auth, $state, growl, BackandService, USER_LINK_TYPE

Operation ->
    1. if(auth.isAuthenticated) : initAuthenticatedUser()
    2. initAuthenticatedUser()
         if(userInSession != null) :       
            initAgent 
                -> getSupplierLinkByAgentIdAndType
            initSupplier
                -> getAgentLinkBySupplierIdAndType
    3. state.go("home")
    4. Defined on-click function for header and footer

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

Login (login.js)
----------------
State -> login, login_success

Using Auth0
    domain: 'wzs21.auth0.com',
    clientID: 'j2ucVyLG1pMqGZiKsGL00QAkHbW21siH'

LoginSuccessController
----------------------
Dependecy -> $scope, BackandService , auth, $state, growl, USER_LINK_TYPE

Operation ->
	1. watchDestroyer : until auth.profile is ready
	2. getUserByAuthId : LoginService.getUserByAuthId
		a. if result == null : //newUser
            -> setFooter(newUser)
		b. else : //oldUser
            -> initUserSession
            -> setFooter(user_type)
	3. state.go("home")

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

User (users.js)
---------------
State -> agents,suppliers,showAgent(id,objectName),showSupplier(id,objectName)

UserController
--------------
Dependency -> $scope, BackandService, auth, $state, $stateParams
Scope -> agents,suppliers
ScopeFunction -> showObjectFunction
Operation ->
    1. if (state.current.name == "agents")
        -> getAllObjects("agents")

    1. if (state.current.name == "suppliers")
        -> getAllObjects("suppliers")

ShowUserController 
------------------
Dependecy -> $scope, BackandService, auth, growl, $state, $stateParams, USER_LINK_TYPE
Scope -> id, objectName, showObject, linkObject, userLinkType, USER_LINK_TYPE
ScopeFunction -> linkUser(operation)
Operation ->
    1. getObjectById ->?(showObject) //Retreive data from DB, showObject <- result
    2. getUserLinkType ->?(userLinkType) //set the $scope.userLinkType
        
        # if(userInSession == null) : userLinkType = NOT_AUTH
        
        # if(state == "showAgent") : 
            -> if(user_type == "supplier") : userLinkType <- FROM DB
                getUserLink(agent_id,supplier_id)
                    DB(userLinks)
                    *linkObject<-result.data 
                    *userLinkType<-result.data.type
            -> if(user_type == "agent") : userLinkType = SAME_TYPE

        # if(state == "showSupplier") : 
            -> if(user_type == "agent") : userLinkType <- FROM DB
                getUserLink(agent_id,supplier_id)
                    DB(userLinks)
                    *linkObject<-result.data 
                    *userLinkType<-result.data.type
            -> if(user_type == "supplier") : userLinkType = SAME_TYPE

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

