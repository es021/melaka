deleteUserLink(agent_id,supplier_id)
{
	DELETE FROM userLinks
	WHERE agent_id LIKE '%{{agent_id}}' AND supplier_id LIKE '%{{supplier_id}}';
}

editUserLink(agent_id,supplier_id,type)
{
	UPDATE userLinks SET type ='{{type}}'
	WHERE agent_id LIKE '{{agent_id}}' AND supplier_id LIKE '{{supplier_id}}';
}

getAgentLinkBySupplierIdAndType(supplier_id,type)
{
	SELECT a.* FROM agents a, userLinks l
	WHERE l.supplier_id LIKE '%{{supplier_id}}'
	AND a.id LIKE l.agent_id
	AND l.type LIKE '%{{type}}';
}

getSupplierLinkByAgentIdAndType(agent_id,type)
{
	SELECT s.* FROM suppliers s, userLinks l
	WHERE l.agent_id LIKE '%{{agent_id}}'
	AND s.id LIKE l.supplier_id
	AND l.type LIKE '%{{type}}';	
}

getAllTransactionByAgent(id)
{
	SELECT *
	FROM transactions
	WHERE agent_id LIKE '%{{id}}';
}

getAllTransactionBySupplier(id)
{
	SELECT *
	FROM transactions
	WHERE supplier_id LIKE '%{{id}}';
}

getUserByAuthId(auth_id)
{
	SELECT * 
	FROM users
	WHERE auth_id like '%{{auth_id}}';
}

getUserbyEmail(email)
{
	SELECT * 
	FROM users
	WHERE email like '%{{email}}';
}

getUserLinkByBothId(agent_id,supplier_id)
{
	SELECT *
	FROM userLinks
	WHERE agent_id LIKE '%{{agent_id}}' 
	AND supplier_id LIKE '%{{supplier_id}}';
}

getProductBySupplierId(supplier_id)
{
	SELECT *
	FROM products
	WHERE supplier_id LIKE '%{{supplier_id}}';
}

