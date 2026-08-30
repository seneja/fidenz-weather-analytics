import { Router, Request, Response } from 'express';
import { getRankedWeather, getCacheDebugInfo } from '../services/weatherService';
import { checkJwt } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/weather:
 *   get:
 *     summary: Retrieve comfort scores and ranks for cities
 *     description: Returns an array of cities with comfort index scores and ranks, sorted by rank. Requires a valid Auth0 JWT token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A JSON array of ranked weather comfort data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cityId:
 *                     type: number
 *                   cityName:
 *                     type: string
 *                   description:
 *                     type: string
 *                   tempCelsius:
 *                     type: number
 *                   comfortScore:
 *                     type: number
 *                   rank:
 *                     type: number
 *       401:
 *         description: Unauthorized - invalid or missing Auth0 token
 *       500:
 *         description: Server error
 */
router.get('/weather', checkJwt, async (req: Request, res: Response) => {
  try {
    const data = await getRankedWeather();
    res.json(data);
  } catch (error: any) {
    console.error('Error in GET /api/weather:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /api/debug/cache:
 *   get:
 *     summary: Retrieve cache status per city
 *     description: Returns cache hit/miss status and cache creation time for all cities. Public endpoint.
 *     responses:
 *       200:
 *         description: A JSON array of cache debug items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cityId:
 *                     type: number
 *                   status:
 *                     type: string
 *                     enum: [HIT, MISS]
 *                   cachedAt:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *       500:
 *         description: Server error
 */
router.get('/debug/cache', (req: Request, res: Response) => {
  try {
    const debugInfo = getCacheDebugInfo();
    res.json(debugInfo);
  } catch (error: any) {
    console.error('Error in GET /api/debug/cache:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
