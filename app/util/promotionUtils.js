import Relay from 'react-relay/classic';
import moment from 'moment';

import {
  preparePlanParams,
  defaultRoutingSettings,
  getQuery,
} from '../util/planParamUtil';

import { getStreetMode, getDefaultOTPModes } from '../util/modeUtils';

export const defaultParams = (currentTime, config, context) => {
  const params = preparePlanParams(config)(
    context.router.params,
    context.router,
  );
  const startingParams = {
    wheelchair: null,
    ...defaultRoutingSettings,
    ...params,
    numItineraries: 1,
    arriveBy: context.router.params.arriveBy || false,
    date: moment(currentTime).format('YYYY-MM-DD'),
    time: moment(currentTime).format('HH:mm'),
  };
  return startingParams;
};
/**
 * Creates a query for Promotion suggestions
 * @param currentTime The current time for the itineraries
 * @param config The current config
 * @param context The current context
 * @param mode The promotion mode
 */

export const getPromotionQuery = (currentTime, config, context, mode) => {
  const startingParams = defaultParams(currentTime, config, context);

  const promotionParams = {
    ...startingParams,
    modes: mode,
  };

  return Relay.createQuery(getQuery(), promotionParams);
};

/**
 * Check the terms for the suggestions
 * @param plan The plan to check
 * @param maxDuration The maximum duration
 * @param maxDistance The maximum distance
 */
export const checkResults = (plan, maxDuration, maxDistance) => {
  if (maxDuration && maxDistance) {
    return plan.duration <= maxDuration && plan.legs[0].distance <= maxDistance
      ? plan
      : null;
  }
  return plan;
};

/**
 * Forms an object suitable to be sent to the PromotionSuggestions component
 * @param plan The plan to be added
 * @param mode The mode for the promotion suggestion
 */
export const createPromotionObject = (plan, mode) => {
  const modeProperties = [
    {
      mode: 'BICYCLE',
      iconName: 'biking',
      textId: 'bicycle',
    },
    {
      mode: 'WALK',
      textId: 'by-walking',
      iconName: 'walk',
    },
  ];

  return {
    ...modeProperties.filter(o => o.mode === mode.toUpperCase())[0],
    plan,
  };
};

/**
 * Call the query for the Biking&Walking suggestions for public transport
 * @param currentTime The current plan time
 * @param config The current config
 * @param context The current context
 * @param modes The promoted modes to search for, takes an array of 2 items
 * @param setPromotionSuggestions the function to set the state
 * @param maxDurationsAndDistances The maximum durations and distances allowed
 */

export const getPromotionPlans = (
  currentTime,
  config,
  context,
  modes,
  setPromotionSuggestions,
  maxDurationsAndDistances,
) => {
  const promotionQuery = getPromotionQuery(
    currentTime,
    config,
    context,
    modes[0],
  );

  const additionalQuery =
    modes.length > 1
      ? getPromotionQuery(currentTime, config, context, modes[1])
      : undefined;

  Relay.Store.primeCache({ promotionQuery }, bikeQueryStatus => {
    if (bikeQueryStatus.ready === true) {
      const firstPlan = Relay.Store.readQuery(promotionQuery)[0].plan
        .itineraries[0];

      if (additionalQuery) {
        Relay.Store.primeCache({ additionalQuery }, additionalQueryStatus => {
          if (additionalQueryStatus.ready === true) {
            const additionalPlan = Relay.Store.readQuery(additionalQuery)[0]
              .plan.itineraries[0];

            setPromotionSuggestions(
              [
                checkResults(
                  firstPlan,
                  maxDurationsAndDistances[0].maxDuration,
                  maxDurationsAndDistances[0].maxDistance,
                ) && createPromotionObject(additionalPlan, modes[0]),
                checkResults(
                  additionalPlan,
                  maxDurationsAndDistances[1].maxDuration,
                  maxDurationsAndDistances[1].maxDistance,
                ) && createPromotionObject(additionalPlan, modes[1]),
              ].filter(o => o),
            );
          }
        });
      } else {
        setPromotionSuggestions(
          [
            checkResults(
              firstPlan,
              maxDurationsAndDistances[0].maxDuration,
              maxDurationsAndDistances[0].maxDistance,
            ) && {
              plan: firstPlan,
              textId: 'bicycle',
              iconName: 'biking',
              mode: 'BICYCLE',
            },
          ].filter(o => o),
        );
      }
    }
  });
};
/**
 * Get the suggestions for cyclists by partially implementing public transport
 */

/**
 * @param itineraries The current itineraries
 * @param context The current context
 * @param config The current config
 * @param currentTime The current time
 * @param setPromotionSuggestions The function to set promotion state
 */

export const checkPromotionQueries = (
  itineraries,
  context,
  config,
  currentTime,
  setPromotionSuggestions,
) => {
  if (itineraries && itineraries.length > 0) {
    const totalTransitDistance = itineraries[0].legs
      .map(leg => leg.distance)
      .reduce((a, b) => a + b, 0);
    if (
      getStreetMode(context.location, context.config) === 'PUBLIC_TRANSPORT' &&
      Math.round(totalTransitDistance / 500) * 500 <= 5000
    ) {
      getPromotionPlans(
        currentTime,
        config,
        context,
        ['BICYCLE', 'WALK'],
        setPromotionSuggestions,
        [
          {
            maxDuration: 1800,
            maxDistance: 5000,
          },
          {
            maxDuration: 1800,
            maxDistance: 2000,
          },
        ],
      );
    } else if (getStreetMode(context.location, context.config) === 'CAR_PARK') {
      getPromotionPlans(
        currentTime,
        config,
        context,
        ['BICYCLE,RAIL,SUBWAY,FERRY', getDefaultOTPModes(config).toString()],
        setPromotionSuggestions,
        [
          {
            maxDuration: 900,
            maxDistance: 2500,
          },
          {
            maxDuration: 900,
            maxDistance: 1000,
          },
        ],
      );
    } else if (getStreetMode(context.location, context.config) === 'BICYCLE') {
      getPromotionPlans(
        currentTime,
        config,
        context,
        ['BICYCLE,RAIL,SUBWAY'],
        setPromotionSuggestions,
        [
          {
            maxDuration: 900,
            maxDistance: undefined,
          },
        ],
      );
    } else {
      setPromotionSuggestions(false);
    }
  }
};
