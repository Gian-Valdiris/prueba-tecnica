//import { ProductRepository } from '../repositorys/product';
const { ProductRepository } = require('../repositorys/product')
const  { Ilogin,Iuser,Iproducts } = require('../interfaces/index');

const mockExecute = jest.fn();
const mockInput = jest.fn(() => ({ execute: mockExecute }));
const mockRequest = jest.fn(() => ({ input: mockInput }));

jest.mock('mssql', () => ({
  ConnectionPool: jest.fn(() => ({
    request: mockRequest
  })),
  NVarChar: jest.fn()
}));

describe('ProductRepository', () => {
  let productRepository = new ProductRepository ()

  beforeEach(() => {
    productRepository = new ProductRepository();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      // Mock de la respuesta de la base de datos
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 10, stock: 5 },
        { id: 2, name: 'Product 2', price: 20, stock: 8 },
      ];

      // Mockear la función mssql.query para que retorne el array de productos
      //@ts-ignore
      (productRepository).mssql.query = jest.fn().mockResolvedValue({ recordset: mockProducts });

      // Llamar a la función getProducts y verificar que retorne el mismo array de productos
      const products = await productRepository.getProducts();
      expect(products).toEqual(mockProducts);
    });
  });

  describe('login', () => {
    it('should return login response for valid credentials', async () => {
      // Mock de la respuesta de la base de datos para un usuario válido
      const mockUser = { id: 1, username: 'testuser', purchase_quota: 100 };

      // Mockear la función mssql.Request.execute para que retorne el usuario válido
      //@ts-ignore
      (productRepository).mssql.Request.prototype.execute = jest.fn().mockResolvedValue({ recordset: [mockUser] });

      // Mockear la función generateJwt para que retorne un token válido
      //@ts-ignore
      (productRepository).generateJwt = jest.fn().mockReturnValue('mocked-token');

      // Datos de prueba para login
      const loginData = { username: 'testuser', password: 'password' };

      // Llamar a la función login y verificar la respuesta
      const loginResponse = await productRepository.login(loginData);
      expect(loginResponse).toEqual({
        ok: true,
        id: mockUser.id,
        purchase_quota: mockUser.purchase_quota,
        username: mockUser.username,
        token: 'mocked-token',
      });
    });

    it('should return login response for invalid credentials', async () => {
      // Mock de la respuesta de la base de datos para credenciales inválidas (usuario no encontrado)
      //@ts-ignore
      (productRepository).mssql.Request.prototype.execute = jest.fn().mockResolvedValue({ recordset: [] });

      // Datos de prueba para login con credenciales inválidas
      const loginData = { username: 'testuser', password: 'invalidpassword' };

      // Llamar a la función login y verificar la respuesta
      const loginResponse = await productRepository.login(loginData);
      expect(loginResponse).toEqual({
        ok: false,
        msg: 'can not start session',
      });
    });
  });

  // Agrega pruebas similares para otras funciones de la clase ProductRepository

});
