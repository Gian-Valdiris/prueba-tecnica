--Table users
create table Users (
	id int primary key identity(1,1),
	username varchar(20) not null,
	password varchar(100) not null,
	purchase_quota decimal(10) not null,
)
create table Products(
	id int primary key identity(1,1),
	name varchar(20) not null,
	price decimal(10,2) not null,
	stock int not null,
	total_sold int 
)
create table Sales (
	id int primary key identity(1,1),
	date_sale Date not null,
	total_sale decimal(10,2) not null,
)

alter table Sales
add user_id int 
alter table [dbo].[Sales]
add constraint FK_sales_user
foreign key (user_id) references Users(id)

create table SalesProducts(
	id int primary key identity(1,1),
	id_sale int,
	id_product int,
	cant int not null,
	unit_price decimal (10,2) not null
	foreign key (id_sale) references Sales(id),
	foreign key (id_product) references Products(id) 
)

create procedure add_sales_produc
	@id_sale int,
	@id_product int,
	@cant int,
	@unit_price decimal(10,2),
as 
begin 
	insert into Products values (@id_sale,@id_product,@cant,@unit_price)
end
-- stores procedures 
-- devolvemos los productos que hay en la base de datos 

create procedure get_products 
as 
begin
	select id,name,price,stock
end 

create procedure login_user 
	@username varchar(20),
	@password varchar(100)
as 
begin 
	select id,purchase_quota from Users where username = @username and password =  @password
end

ALTER PROCEDURE create_sale
    @total DECIMAL(10,2),
    @date DATE,
    @user INT 
AS 
BEGIN 
    BEGIN TRY
        INSERT INTO Sales VALUES (@date, @total, @user);
        SELECT SCOPE_IDENTITY() AS 'newSaleId';
    END TRY
    BEGIN CATCH
        -- En caso de error, se captura la excepción y se devuelve NULL
        SELECT NULL AS 'newSaleId';
    END CATCH;
END;


create procedure add_sales_product
	@id_sale int,
	@id_product int,
	@cant int,
	@unit_price decimal(10,2)
as
begin 
	begin try
		insert into SalesProducts values (@id_sale,@id_product,@cant,@unit_price)
	end try
	begin catch 
		select null as 'newSaleProduct'
	end catch
end

alter procedure update_product_total_sold
	@id int,
	@cant int 
as

begin 
	begin try
		update Products set  total_sold = total_sold + @cant where id = @id 
	end try
	begin catch
		select null as 'UpdateProductSold'
	end catch 

end

alter procedure update_purhase_quote
	@id int,
	@total decimal(10,2)
as
begin 
	begin try
		update Users set purchase_quota = purchase_quota - @total where id = @id
	end try

	begin catch
		select null as 'updatePurchaseUser'
	end catch
end

alter procedure verify_purchase_quota
	@id int 

as
begin 
	select TOP 1 purchase_quota from [dbo].[Users] where id = @id

end