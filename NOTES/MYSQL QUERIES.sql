var start_from = OFFSET.PAGE * (page_number-1);

"BACKAND_APP_NAME" : "dropbug",
"BACKAND_TOKEN" : "5ee54b6c-f992-4a78-b789-0a36721791c7"

"BACKAND_APP_NAME" : "wzs21testapp",
"BACKAND_TOKEN" : "19251d3d-7ae7-4ca1-993b-60c67ddc0385"

////////////////////////////////////////////////////////////////
getUserActiveListing

SELECT 
    t.*,
    CONCAT(u.first_name," ",u.last_name) AS other_user_name,
    u.id AS other_user_id,
    p.name AS product_name

FROM transactions t, users u, products p

WHERE 
    t.to_user_id LIKE '%{{user_id}}' AND
    u.id LIKE t.from_user_id AND
    p.id LIKE t.product_id AND
        t.type LIKE 'Delivery' AND

    (status < 5 OR payment_status < 8 )

OR

    t.from_user_id LIKE '%{{user_id}}' AND
    u.id LIKE t.to_user_id AND
    p.id LIKE t.product_id AND
        t.type LIKE 'Delivery' AND

    (status < 5 OR payment_status < 8 )
    
ORDER BY updated_at DESC;

////////////////////////////////////////////////////////////////


getLinkedUserById(id)
{
	SELECT DISTINCT l.updated_at AS linked_at , u.*
	FROM userLinks l, users u
	WHERE 

	l.from_user_id LIKE '%{{id}}' 
	AND u.id LIKE l.to_user_id
	AND l.type LIKE 1

	OR 

	l.to_user_id LIKE '%{{id}}' 
	AND u.id LIKE l.from_user_id
	AND l.type LIKE 1;
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

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

