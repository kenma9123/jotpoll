import * as types from '../constants/ActionTypes';
import { API_URL } from '../config';

/**
 * Ticket related action creators
 */

/**
 * will fetch form using the API
 * for this to be catch by api middleware
 * pass types as one of the object properties
 */
export function fetchTickets(payload) {
  return {
    types: [types.TICKETS_FETCH, types.TICKETS_FETCH_SUCCESS, types.TICKETS_FETCH_FAILURE],
    payload
  };
}

export function fetchTicketsBy(payload) {
  return {
    types: [types.TICKETS_FETCH_BY, types.TICKETS_FETCH_BY_SUCCESS, types.TICKETS_FETCH_BY_FAILURE],
    endpoint: API_URL,
    payload: {
      method: 'POST',
      data: {
        action: 'fetchTicketsBy',
        ...payload
      }
    }
  };
}

export function fetchTicket(ticketID) {
  return {
    types: [types.TICKET_FETCH, types.TICKET_FETCH_SUCCESS, types.TICKET_FETCH_FAILURE],
    endpoint: API_URL,
    payload: {
      method: 'POST',
      data: {
        action: 'getTicket',
        ticketID
      }
    }
  };
}

export function fetchRandomTicket() {
  return {
    types: [types.TICKET_FETCH_RANDOM, types.TICKET_FETCH_RANDOM_SUCCESS, types.TICKET_FETCH_RANDOM_FAILURE],
    endpoint: API_URL,
    payload: {
      method: 'POST',
      data: {
        action: 'getRandomTicket'
      }
    }
  };
}

export function fetchRecentCategorized(offset, limit) {
  return {
    types: [types.RECENT_CATEGORIZED_FETCH, types.RECENT_CATEGORIZED_FETCH_SUCCESS, types.RECENT_CATEGORIZED_FETCH_FAILURE],
    endpoint: API_URL,
    payload: {
      method: 'POST',
      data: {
        action: 'getRecentCategorized',
        offset,
        limit
      }
    }
  };
}

export function resetTicketList(listname) {
  return {
    type: types.RESET_TICKET_LIST,
    listname
  };
}

export function fetchUncategorized(offset, limit) {
  return {
    types: [types.UNCATEGORIZED_FETCH, types.UNCATEGORIZED_FETCH_SUCCESS, types.UNCATEGORIZED_FETCH_FAILURE],
    endpoint: API_URL,
    payload: {
      method: 'POST',
      data: {
        action: 'getUncategorized',
        offset,
        limit
      }
    }
  };
}

export function resetUncategorize() {
  return {
    type: types.RESET_UNCATEGORIZED
  };
}

