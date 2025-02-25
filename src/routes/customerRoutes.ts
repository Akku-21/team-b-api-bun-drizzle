import { Elysia, t } from 'elysia'
import { CustomerService } from '../services/customerService'
import { createCustomerDataSchema, customerDataResponse, customerDataSchema, customersDataResponse, errorResponse, successResponse } from '../types/customer'
import { NotFoundError } from '../errors/errors'

const customerService = new CustomerService()

export const customerRoutes = new Elysia({ prefix: '/customers' })
  .post('/', async ({ body, set }) => {
    try {
      const result = await customerService.createCustomer(body)
      set.status = 200
      return result
    } catch (error) {
      set.status = 500
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      }
    }
  }, {
    body: createCustomerDataSchema,
    response: t.Union([successResponse, errorResponse])
  })
  .get('/:customerId', async ({ params: { customerId }, set }) => {
    try {
      const result = await customerService.getCustomer(customerId)
      set.status = 200
      return result
    } catch (error) {
      set.status = error instanceof NotFoundError ? 404 : 500
      return {
        success: false as const,
        message: error instanceof Error ? error.message : 'Internal server error'
      }
    }
  }, {
    params: t.Object({
      customerId: t.String()
    }),
    response: t.Union([customerDataResponse, errorResponse])
  })
  .get('/', async ({ set }) => {
    try {
      const result = await customerService.getAllCustomers()
      set.status = 200
      return result
    } catch (error) {
      set.status = 500
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      }
    }
  }, {
    response: t.Union([customersDataResponse, errorResponse])
  })
  .delete('/:customerId', async ({ params: { customerId }, set }) => {
    try {
      const result = await customerService.deleteCustomer(customerId)
      set.status = 200
      return result
    } catch (error) {
      set.status = error instanceof NotFoundError ? 404 : 500
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      }
    }
  }, {
    params: t.Object({
      customerId: t.String()
    }),
    response: t.Union([successResponse, errorResponse])
  })
