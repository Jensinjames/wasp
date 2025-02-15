import { test, expect } from 'vitest'
import { screen } from '@testing-library/react'

import { mockServer, renderInContext } from 'wasp/test'
import { getTasks } from 'wasp/rpc/queries'
import { Todo, areThereAnyTasks } from './Todo'
import { MainPage } from './MainPage'
import type { User } from 'wasp/auth/types'
import { getMe } from 'wasp/auth/useAuth'
import { Tasks } from 'wasp/crud/Tasks'

const mockTasks = [
  {
    id: 1,
    description: 'test todo 1',
    isDone: true,
    userId: 1,
  },
]

const mockAllTasks = [
  {
    id: 2,
    description: 'test todo 2',
    isDone: true,
    userId: 1,
  },
]

test('handles unit testing', () => {
  expect(areThereAnyTasks([])).toBe(false)
})

test('handles rendering in context', () => {
  renderInContext(<Todo {...mockTasks[0]} />)

  expect(screen.getByText('test todo 1')).toBeInTheDocument()
})

const { mockQuery } = mockServer()

const mockUser = {
  id: 12,
  auth: {
    id: '123',
    userId: 12,
    identities: [
      {
        authId: '123',
        providerName: 'email',
        providerUserId: 'elon@tesla.com',
        providerData: '',
      },
    ],
  },
  address: '',
} satisfies User

test('handles mock data', async () => {
  mockQuery(getTasks, mockTasks)
  mockQuery(getMe, mockUser)
  mockQuery(Tasks.getAll.query, mockAllTasks)

  renderInContext(<MainPage user={mockUser} />)

  await screen.findByText('test todo 1')
  await screen.findByText('test todo 2')

  expect(screen.getAllByRole('checkbox')[0]).toBeChecked()

  screen.debug()
})
