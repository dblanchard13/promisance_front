import { eraArray } from "../../../config/eras"
import { PVTM_MAXSELL } from "../../../config/config"
import GuideLink from "../../utilities/guidelink"

export default function BlackMarketGuide({ empire })
{

    return (
        <div>
            <GuideLink text='Return to Index' page='Index' />
            <h2>The Private Market - Buying</h2>
            <p>Within every empire, there exist those who train mercenaries, build instruments of war, and stockpile food. If your empire's {eraArray[empire.era].bldtrp} and {eraArray[empire.era].bldfood} do not produce enough to sustain its citizens and army, you may spend your money here to purchase these goods.</p>
            <p>Only a finite number of goods can be purchased from the private market in a given time span - once depleted, you will need to wait for more to be produced. The rate at which units and food are replenished is based on both the overall size of your empire and how many {eraArray[empire.era].bldcost} and {eraArray[empire.era].bldfood} you have, respectively.</p>
            <p>The cost of goods on the private market is affected by your economy and your ability to maintain such units - having a large percentage of your empire occupied by {eraArray[empire.era].bldcash} and {eraArray[empire.era].bldcost} will reduce the purchase prices of military units by up to 40%; however, food prices are not affected.</p>

            <h2>The Private Market - Selling</h2>
            <p>Just as you can purchase from the private market, you can also quickly sell your excess goods to it, though for significantly lower returns.</p>
            <p>As is the case with buying, having a large percentage of your empire occupied by {eraArray[empire.era].bldcash} and {eraArray[empire.era].bldcost} will increase the selling prices of military units to up to 50% of their usual purchase price.</p>
            <p>A maximum of {PVTM_MAXSELL / 100}% of each type of military unit can be sold on the private market in a given time span - in order to sell more, you must wait a while.</p>
        </div>
    )
}