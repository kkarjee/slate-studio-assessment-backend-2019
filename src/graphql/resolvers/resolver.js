import { UserInputError, ApolloError } from 'apollo-server-core';
import Incident from '../../models/Incident'
import User from '../../models/User'
import { STATUS_CREATED, STATUS_ACKNOWLEDGED, ROLE_ENGINEER, STATUS_RESOLVED } from '../../config'

const { ObjectId } = require('mongoose').Types;

/**
 * Create and return query object. When multiple fields are passed it uses AND condition
 * @param {Object} filters
 */
const getSearchQuery = (filters) => {
  const query = {}
  const conditions = [];
  const {
    title, description, status, assigneeId
  } = filters;
  if (status) {
    conditions.push({ status });
  }
  if (title) {
    conditions.push({ title: { $regex: title, $options: 'i' } })
  }
  if (description) {
    conditions.push({ description: { $regex: description, $options: 'i' } })
  }
  if (assigneeId) {
    conditions.push({ assigneeId: ObjectId(assigneeId) })
  }
  if (conditions.length) {
    query.$and = conditions
  }
  return query
}

export default {
  Query: {
    incidents: () => Incident.find({}),
    /**
     * Search Incident
     */
    search: async (_parent, {
      limit, page, filters, sortBy, sortOrder
    }) => {
      limit = parseInt(limit, 10);
      page = parseInt(page, 10) || 1;
      const query = getSearchQuery(filters);
      const order = sortOrder === 'DESC' ? -1 : 1
      let sort = {
        createdAt: order
      }
      if (sortBy === 'UPDATE') {
        sort = {
          updatedAt: order
        }
      }
      return Incident.paginate(query, {
        page,
        limit,
        sort
      }, (err, result) => {
        if (err) {
          throw new ApolloError('Unexpected error while searching.', {
            invalidArgs: {}
          });
        }
        return {
          docs: result.docs,
          pageInfo: {
            hasNextPage: result.hasNextPage,
            nextPage: result.nextPage,
            hasPrevPage: result.hasPrevPage,
            prevPage: result.prevPage
          }
        }
      });
    },

    incident: async (_, args) => Incident.findById(args.id),
    users: async () => User.find({}),
  },

  Incident: {
    assignee: async (incident) => User.findById(incident.assigneeId)
  },

  Mutation: {
    /**
     * Create Incident, if assigneeId is not provided the ticket is assigned to the first Engineer
     */
    create: async (_, { title, description = '', assigneeId = null }) => {
      if (!title) {
        throw new UserInputError('You must provide a valid title.', {
          invalidArgs: {}
        });
      }
      if (!assigneeId) {
        const firstEngineer = await User.findOne({ role: ROLE_ENGINEER })
        if (firstEngineer) {
          assigneeId = firstEngineer._id.toString()
        }
      }
      if (!assigneeId) {
        throw new UserInputError('The Incident cannot be assigned to an Engineer. Please provide an assignee', {
          invalidArgs: {}
        });
      }

      const incident = new Incident({
        title,
        description,
        assigneeId: ObjectId(assigneeId),
        status: STATUS_CREATED
      })
      await incident.save()
      return incident;
    },

    /**
     * Assign Incident to a user
     */
    assign: async (_, { id, assigneeId }) => Incident.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { assigneeId: ObjectId(assigneeId) } },
      { new: true }
    ),

    /**
     * Acknowledge
     */
    acknowledge: async (_, { id }) => Incident.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { status: STATUS_ACKNOWLEDGED } },
      { new: true }
    ),

    /**
     * Acknowledge
     */
    resolve: async (_, { id }) => Incident.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { status: STATUS_RESOLVED } },
      { new: true }
    ),

    /**
     * Delete Incident
     */
    delete: async (_, { id }) => Incident.deleteOne(
      { _id: ObjectId(id) }
    ).then((res) => res.deletedCount)
  }
};
