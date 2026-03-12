/*:
 * @target MZ
 * @author Puppet Knight
 * @version 1.6
 *
 * @plugindesc Adds dynamic elemental effects to skills, including state infliction, customizable damage modifiers, and advanced elemental cycle mechanics.
 *
 * @help
 *
 * PuppetKnight_ElementImpact
 * 
 * This plugin enhances your RPG Maker MZ project by introducing advanced elemental mechanics to skills. 
 * Supports checking for multiple  Elements when using <multElement:> from plugins like NUUN_MultiElement
 *
 * It allows for the following features:
 * 
 * 1. **Element Cycles:**
 *    - Define custom cyclical relationships between elements using plugin parameters.
 *    - Each cycle can specify:
 *      - **Elements**: The IDs of the elements in the cycle.
 *      - **Strength Multiplier**: Percentage-based bonus damage for advantageous elements.
 *      - **Weakness Multiplier**: Percentage-based penalty for disadvantaged elements.
 *    - For two-element cycles, both elements are always weak to one another, and only the Strength Multiplier applies.
 *    - For single cycles, the element is strong against itself, and only the Strength Multiplier applies.
 * 
 * 2. **Element Rule:**
 *    - Determines how a battler's current element is selected for Element Cycle effects.
 *    - Options include:
 *      - **Last Used Element**: Uses the last element the battler applied with an action.
 *      - **Last Hit Element**: Uses the last element the battler was hit by.
 *      - **Higher Stack**: Compares the stacks of the battler's last used and last hit elements, using the element associated with the higher stack.
 * 
 * 3. **Reflect Mechanic:**
 *    - Damage reflection, based on the Element Rule chosen and maxStacks.
 *    - Full damage returned to subject of action, designed to prevent infinite reflection loop.
 *    - Set Animation to be played on the target when successful reflect occurs.
 *    - Reflect Mechanic is optional and can be disabled in plugin parameters.	
 *
 * 4. **State Infliction:**
 *    - Assign states to be inflicted based on the element of a skill.
 *    - Configure the chance of state infliction per element.
 * 
 * 5. **Damage Modifiers:**
 *    - Apply percentage-based multipliers to skill damage when specific states are present on the target.
 *    - Specify multipliers as percentages (e.g., 100 for no change, 150 for 150%, 75 for 75%).
 * 
 * 6. **Consecutive Use and Hit Effects:**
 *    - Track consecutive uses of an element by an actor (Use Stacks).
 *    - Track consecutive hits from an element on a target (Hit Stacks).
 *    - Adjust damage dynamically based on stack values.
 *    - Configure stack effects using percentage multipliers.
 *
 * 7. **Element Icons, Checking Element Info of Skill:**
 *    - Script Calls for the following
 *
 * 		PK_ElementImpact.elementIcon(elementId)
 * 		- Retrieves the icon index for the given element ID.
 * 		- If no icon index is defined, it returns 0 by default.
 *
 * 		Example:
 * 		const iconIndex = PK_ElementImpact.elementIcon(3); // Gets the icon index for element ID 3
 *
 * 		PK_ElementImpact.skillElementId(skillId)
 * 		- Retrieves the element ID of the given skill.
 * 		- If no element ID is defined, it returns 0 by default.
 *
 * 		Example:
 * 		const skillElemId = PK_ElementImpact.skillElementId(45); // Gets element ID of skill 45
 *
 * 		PK_ElementImpact.skillElementName(skillId)
 * 		- Retrieves the element Name of the given skill.
 * 		- If no element Name is defined, it returns "" by default.
 *
 * 		Example:
 * 		const skillElemName = PK_ElementImpact.skillElementName(100); // Gets element name of skill 100
 *
 * 		PK_ElementImpact.skillElementIcon(skillId)
 * 		- Retrieves an array of Element Icon Indices .
 * 		- If no elements are found for the skill or no skill is found, returns an empty array.
 *
 * 		Example:
 * 		const skillElementIcon = PK_ElementImpact.skillElementIcon(100); // Returns an array of icon indices for skill ID 100
 * 
 * 
 * **Highly Configurable:**
 *    - Fine-tune the behavior of elemental mechanics using plugin parameters.
 *    - Customize state infliction rates, damage multipliers, and stack settings.
 * 
 * ### Plugin Parameters:
 * - **Relationship Settings:**
 * - **Element Cycles:**
 *   - Define multiple elemental cycles with specific strengths, weaknesses, and relationships.
 *   - Choose how battlers' elements are determined for Element Cycle effects.
 *   - Choose if target's current Element and maxStacks cause skill damage to be reflected back to its user.
 *   - Decide what animation plays on the target when reflecting damage (if any).
 * - **State Settings:**
 *   - Define which states are inflicted by specific elements and their chances.
 *   - Add state-based damage modifiers linked to elements.
 * - **Element Use Settings:**
 *   - Control how consecutive use of elements affects damage using percentage multipliers.
 * - **Element Hit Settings:**
 *   - Control how consecutive hits from elements affect damage using percentage multipliers.
 * 
 * ### New `Game_Battler` Properties:
 * - `lastHitElem` - Tracks the last Element ID that hit the target.
 * - `lastHitStack` - Tracks consecutive times the target has been hit by the same element in a row.
 * - `lastUsedElem` - Tracks the last Element ID used by the subject in battle.
 * - `lastUsedStack` - Tracks consecutive times the same element has been used in a row by the subject.
 * - `elementMulti` - Manages the multiplier that increases or decreases skill damage based on the target's state and element relationships.
 * - `elementImpact` - Calculates the difference in damage due to stack effects and state impact damage.
 * - `elementCurrent` - Updated when the function `PK_ElementImpact.getCurrentElement(battler). Useful for checks, and other peoples plugins.
 *
 *  - Stacks and `lastElem` properties reset if the current and previous elements differ.
 *  - `elementMulti` resets every turn.
 *  - `elementImpact` persists on the subject of an action until they take a new action. This property can be referenced by other plugins.
 *  - Reflect - target must be of the current Element of action being used, 
 *		and have that lastUsed or lastHit stack === maxStacks based on Element Rule.	
 *
 * ### New Notetag:
 *	<noReflect> This notetag is used to prevent a skill from being reflected no matter what the targets element is
 *	<noStacks> This notetag is used to avoid damage changes or reductions based on stacks. Element cycle changes still Apply
 * 	<noCycle> This notetag is used to avoid damage changes due to Element Cycles
 * 	<ignoreAll> This notetag is used for all three effects above
 * 	NONE of these notetags mitigate damage related to state Impact multipliers. 
 *	Stack increases and element changes still update as needed.
 *
 *
 * This plugin opens up new strategic possibilities for skills and elements in your game, adding depth and variety to combat.
 *
 *
 * Terms: You're free to use this plugin in commercial or non-commercial projects.
 * Must credit Puppet Knight as the author. While a copy of the game is not required, it would be appreciated! 😊
 *

 *
 * @param ElementIcons
 * @text Element Icon Settings
 * @type struct<ElementIconEntry>[]
 * @desc Define the icon index for each element.
 * Entry number === ElementId
 * @default []
 *
 * @param Relationship Settings
 * @text Relationship Settings
 *
 * @param State Settings
 * @text State Settings
 *
 * @param Element Use Settings
 * @text Use Settings
 *
 * @param Element Hit Settings
 * @text Hit Settings
 *
 * @param DebugMode
 * @text Debug Mode
 * @desc Enable console logging for debugging/testing purposes.
 * Show User and Target Element. Multiplier and Cycle damage.
 * @type boolean
 * @default false
 *
 * @param ElementCycles
 * @parent Relationship Settings
 * @text Element Cycles
 * @type struct<ElementCycle>[]
 * @desc Define multiple elemental cycles with specific strengths, weaknesses, and element relationships.
 * @default []
 *
 * @param Element Rule
 * @parent Relationship Settings
 * @text Element Rule
 * @desc What determines a battler's current Element?
 * ~See Help for more information~
 * @type select
 * @option Last Used Element
 * @value lastUsed
 * @option Last Hit Element
 * @value lastHit
 * @option Higher Stack
 * @value highStack
 * @default lastUsed
 *
 * @param Enable Reflect
 * @parent Relationship Settings
 * @text Enable Reflect Mechanic
 * @desc Enable or disable the reflect mechanic for skills.
 * @type boolean
 * @default true

 * @param Reflect Animation
 * @parent Relationship Settings
 * @text Reflect Animation
 * @desc ID of the animation to play when a skill is reflected.
 * @type animation
 * @default 0

 * @param ElementImpacts
 * @parent State Settings
 * @text Element State Impacts
 * @type struct<ElementImpact>[]
 * @default []
 *
 * @param StateDamageModifiers
 * @parent State Settings
 * @text State Modifiers
 * @type struct<StateDamageModifier>[]
 * @default []
 *
 *
 * @param useModifier
 * @parent Element Use Settings
 * @text Use Damage Multiplier (%)
 * @desc Default multiplier for damage from consecutive USE of an element.
 * Ex: 100 = no change, 150 = 150%, 75 = 75%.
 * @type number
 * @min 0
 * @default 100
 *
 * @param MaxUsedStack
 * @parent Element Use Settings
 * @text Max Used Stack
 * @desc Highest Stack possible for Subject to track consecutive
 * use of Element Id. (Default: 5)
 * @default 5
 * @type number
 * @min 1
 *
 * @param hitModifier
 * @parent Element Hit Settings
 * @text Hit Damage Multiplier (%)
 * @desc Default multiplier for damage from consecutive HITS of an element.
 * Ex: 100 = no change, 150 = 150%, 75 = 75%.
 * @type number
 * @min 0
 * @default 100
 *
 * @param MaxHitStack
 * @parent Element Hit Settings
 * @text Max Hit Stack
 * @desc Highest Stack possible for Target to track consecutive
 * hits from Element Id. (Default: 5)
 * @default 5
 * @type number
 * @min 1
 *
 */

/*~struct~ElementImpact:
 * @param Impact Name
 * @text Impact Name
 * @desc Name Your Element - State Association.
 * This is purely for organization
 * @type string
 * @default Fire Burns!
 *
 * @param elementId
 * @text Element ID
 * @desc The ID of the element that triggers the state infliction.
 * @type element
 * @default 1
 *
 * @param stateId
 * @text State ID
 * @desc The ID of the state to be inflicted.
 * @type state
 * @default 1
 *
 * @param chance
 * @text Infliction Chance (%)
 * @desc The percentage chance of the state being inflicted.
 * Default: 75%, Min: 1%
 * @type number
 * @min 1
 * @max 100
 * @default 75
 */
 
/*~struct~StateDamageModifier:
 * @param Modifier Name
 * @text Modifier Name
 * @desc Name Your State Damage Modifier.
 * This is purely for organization.
 * @type string
 * @default Water Ousts Fire!
 *
 * @param targetStateId
 * @text Target State ID
 * @desc The ID of the state that must be present on the target.
 * @type state
 * @default 1
 *
 * @param elementId
 * @text Element ID
 * @desc The ID of the element that triggers the damage modifier.
 * @type number
 * @default 1
 *
 * @param damageMultiplier
 * @text Damage Multiplier (%)
 * @desc The multiplier for damage as a percentage 
 * Ex: 100 = no change, 150 = 150%, 75 = 75%.
 * @type number
 * @min 0
 * @default 100
 *
 *
 * @param removeState
 * @text Remove State After Damage
 * @desc If true, the target state is removed after damage calculation.
 * @type boolean
 * @default false
 *
 * @param addStateId
 * @text State to Add
 * @desc The ID of the state to add after damage calculation.
 * @type state
 * @default 0
 */
 
 /*~struct~ElementCycle:
 * @param CycleName
 * @text Cycle Name
 * @desc Name of this cycle (for organization purposes).
 * @type string
 * @default Element Cycle
 *
 * @param Elements
 * @text Elements
 * @desc Comma-separated list of element IDs in this cycle. The order defines strengths and weaknesses. Last beats first.
 * @type string
 * @default 1,2,3
 *
 * @param StrengthMultiplier
 * @text Strength Multiplier (%)
 * @desc Multiplier applied when an element has an advantage in this cycle.
 * Ex: 100 = no change, 150 = 150%, 75 = 75%
 * @type number
 * @min 0
 * @default 150
 *
 * @param WeaknessMultiplier
 * @text Weakness Multiplier (%)
 * @desc Multiplier applied when an element has a disadvantage in this cycle.
 * Ex: 100 = no change, 150 = 150%, 75 = 75%.
 * @type number
 * @min 0
 * @default 50
 */
 
 /*~struct~ElementIconEntry:
 * @param Name
 * @text Element Name
 * @type text
 * @desc Name of this element.
 * For organizational purposes only
 * @default Fire
 *
 * @param IconIndex
 * @text Icon Index
 * @type icon
 * @desc The icon index to display for this element.
 * @default 64
 */

var PK_ElementImpact = PK_ElementImpact || {};

PK_ElementImpact.init = function() {
    const parameters = PluginManager.parameters('PuppetKnight_ElementImpact');
	this.debugMode = parameters['DebugMode'] === 'true'; 
    this.elementImpacts = JSON.parse(parameters['ElementImpacts']).map(e => JSON.parse(e));
    this.stateDamageModifiers = JSON.parse(parameters['StateDamageModifiers']).map(e => JSON.parse(e));
    this.maxUsedStack = Number(parameters['MaxUsedStack'] || 1);
    this.maxHitStack = Number(parameters['MaxHitStack'] || 1);
    this.useModifier = parseFloat(parameters['useModifier'] || 100) / 100;
    this.hitModifier = parseFloat(parameters['hitModifier'] || 100) / 100;
	this.elementRule = String(parameters['Element Rule'] || 'lastUsed');
	this.elementCycles = JSON.parse(parameters['ElementCycles'] || "[]").map(cycle => {
        const parsedCycle = JSON.parse(cycle);
        return {
            name: parsedCycle.CycleName,
            elements: parsedCycle.Elements.split(',').map(id => parseInt(id.trim())),
            strengthMultiplier: parseFloat(parsedCycle.StrengthMultiplier || 1.5),
            weaknessMultiplier: parseFloat(parsedCycle.WeaknessMultiplier || 0.5),
        };
    });
	this.reflectAnimation = Number(parameters['Reflect Animation']) || 0;
    this.enableReflect = parameters['Enable Reflect'] === 'true';   
	this.elementIcons = JSON.parse(parameters['ElementIcons'] || "[]").map(entry => {
		const parsed = JSON.parse(entry);
		parsed.IconIndex = Number(parsed.IconIndex || 0);
		return parsed;
	});

};


// Function to get icon index for an element
PK_ElementImpact.elementIcon = function(elementId) {
    const entry = this.elementIcons[elementId - 1];
    return entry ? Number(entry.IconIndex) : 0;
};

// Returns an array of element IDs for a skillId, including multElement support
PK_ElementImpact.skillElementId = function(skillId) {
    const skill = $dataSkills[skillId];
    if (!skill) return [];

    const baseId = skill.damage?.elementId ?? 0;
    const extraIds = skill.meta?.multElement
        ? skill.meta.multElement.split(',').map(Number)
        : [];

    const filteredExtraIds = extraIds.filter(id => {
        const tag = `multElementRate${id}`;
        return skill.meta?.[tag]
            ? Math.randomInt(100) < Number(skill.meta[tag])
            : true;
    });

    return [baseId, ...filteredExtraIds].filter(id => id > 0);
};

// Returns an array of element names from a skillId
PK_ElementImpact.skillElementName = function(skillId) {
    const ids = PK_ElementImpact.skillElementId(skillId);
    return ids.map(id => $dataSystem.elements[id] || "");
};



// Returns an array of icon indices for all elements on a skillId
PK_ElementImpact.skillElementIcon = function(skillId) {
    const ids = PK_ElementImpact.skillElementId(skillId);
    const icons = [];

    for (const id of ids) {
        const entry = PK_ElementImpact.elementIcons[id - 1];
        if (entry && entry.IconIndex > 0) {
            icons.push(entry.IconIndex);
        }
    }

    return icons;
};


// Get relationship multiplier based on element IDs
PK_ElementImpact.getElementMultiplier = function(sourceElement, targetElement, reverse = false) {
    for (const cycle of this.elementCycles) {
        const sourceIndex = cycle.elements.indexOf(sourceElement);
        const targetIndex = cycle.elements.indexOf(targetElement);

        if (sourceIndex !== -1 && targetIndex !== -1) {
            // Handle reversed logic
            const strengthMultiplier = parseFloat(cycle.strengthMultiplier || 100) / 100;
            const weaknessMultiplier = parseFloat(cycle.weaknessMultiplier || 100) / 100;

            if (reverse) {
                // Reverse strengths and weaknesses
                if ((sourceIndex + 1) % cycle.elements.length === targetIndex) {
                    return weaknessMultiplier; // Reversed: Source is weaker
                } else if ((targetIndex + 1) % cycle.elements.length === sourceIndex) {
                    return strengthMultiplier; // Reversed: Source is stronger
                }
            } else {
                // Normal strengths and weaknesses
                if ((sourceIndex + 1) % cycle.elements.length === targetIndex) {
                    return strengthMultiplier; // Source is stronger
                } else if ((targetIndex + 1) % cycle.elements.length === sourceIndex) {
                    return weaknessMultiplier; // Source is weaker
                }
            }
        }
		if (PK_ElementImpact.debugMode) {
			console.log(`Source Element: ${sourceElement}, Target Element: ${targetElement}`);
			console.log(`Reverse: ${reverse}`);
			console.log(`Cycle Found: ${!!cycle}`);
		}
    }
    return 1.0; // Default multiplier for no relationship
};


// Determine the current element for a single battler based on the elementRule
PK_ElementImpact.getCurrentElement = function(battler) {
    let currentElement;

    if (this.elementRule === 'lastUsed') {
        currentElement = battler.lastUsedElem;
    } else if (this.elementRule === 'lastHit') {
        currentElement = battler.lastHitElem;
    } else if (this.elementRule === 'highStack') {
        currentElement = battler.lastUsedStack >= battler.lastHitStack ? battler.lastUsedElem : battler.lastHitElem;
    }

    // Assign the determined element to elementCurrent
    battler.elementCurrent = currentElement || 0; // Default to 0 if no element is determined

    if (PK_ElementImpact.debugMode) {
        console.log(`Updated elementCurrent for ${battler.name()}: ${battler.elementCurrent}`);
    }

    return battler.elementCurrent;
};




PK_ElementImpact.resetStacks = function(battler) {
    battler.lastHitElem = 0;
    battler.lastHitStack = 0;
    battler.lastUsedElem = 0;
    battler.lastUsedStack = 0;
    battler.elementMulti = 1;
    battler.elementImpact = 0;
	battler.elementCurrent = 0;
};

// Initialize plugin
PK_ElementImpact.init();

// Alias Game_Battler initMembers
const PK_ELE_IMP_Game_Battler_initMembers = Game_Battler.prototype.initMembers;
Game_Battler.prototype.initMembers = function() {
    PK_ELE_IMP_Game_Battler_initMembers.call(this);
    PK_ElementImpact.resetStacks(this);
};

// Alias Scene_Battle start
const PK_ELE_IMP_Scene_Battle_start = Scene_Battle.prototype.start;
Scene_Battle.prototype.start = function() {
    PK_ELE_IMP_Scene_Battle_start.call(this);
    $gameParty.members().forEach(PK_ElementImpact.resetStacks);
    $gameTroop.members().forEach(PK_ElementImpact.resetStacks);
};

Game_Action.prototype.checkReflectCondition = function(target) {
    const item = this.item();
    const elementId = item.damage.elementId;

    if (elementId <= 0) return false; // No element assigned

    // Check if element is part of a single-element cycle
    const cycle = PK_ElementImpact.elementCycles.find(c => c.elements.length === 1 && c.elements[0] === elementId);
    if (cycle) return false; // Reflection not allowed for single-element cycles

    // Check current element based on elementRule
    const currentElement = PK_ElementImpact.getCurrentElement(target);

    // HighStack Rule Adjustment
    if (PK_ElementImpact.elementRule === 'highStack') {
        if (
            target.lastUsedStack === PK_ElementImpact.maxUsedStack &&
            target.lastHitStack === PK_ElementImpact.maxHitStack
        ) {
            // Both stacks are maxed, check if either matches the action's element
            const isMatchingElement =
                target.lastUsedElem === elementId || target.lastHitElem === elementId;
            return isMatchingElement;
        }
    }

    // Standard reflection check for stacks and element rule
    const isMaxStack = target.lastUsedStack === PK_ElementImpact.maxUsedStack || target.lastHitStack === PK_ElementImpact.maxHitStack;
    const isCurrentElement = currentElement === elementId;

    return isMaxStack && isCurrentElement;
};


Game_Action.prototype.reflectSkill = function(value, target) {
    const user = this.subject();
	
    if (PK_ElementImpact.debugMode) {
        console.log(`${target.name()} reflected ${this.item().name} back to ${user.name()} for ${value} damage.`);
    }

    // Set reflection flag to prevent recursive reflections
    this._isReflected = true;

    // Apply the reflected damage to the original user
    this.executeDamage(user,value); // Apply calculated damage to the user

    // Display reflection animation if configured
    const reflectAnimation = PK_ElementImpact.reflectAnimation || 0;
    if (reflectAnimation > 0) {
        $gameTemp.requestAnimation([target], reflectAnimation);
    }
};

PK_ElementImpact.updateElementTracking = function(user, target, elementId) {
    if (elementId > 0) {
        // Update user's lastUsedElem and lastUsedStack
        if (user.lastUsedElem !== elementId) user.lastUsedStack = 0;
        user.lastUsedElem = elementId;

        // Update target's lastHitElem and lastHitStack
        if (target.lastHitElem !== elementId) target.lastHitStack = 0;
        target.lastHitElem = elementId;

        // Increment stacks
        user.lastUsedStack = Math.min(user.lastUsedStack + 1, PK_ElementImpact.maxUsedStack);
        target.lastHitStack = Math.min(target.lastHitStack + 1, PK_ElementImpact.maxHitStack);

        if (PK_ElementImpact.debugMode) {
            console.log(`Updated Tracking:`);
            console.log(`User: ${user.name()}, lastUsedElem: ${user.lastUsedElem}, lastUsedStack: ${user.lastUsedStack}`);
            console.log(`Target: ${target.name()}, lastHitElem: ${target.lastHitElem}, lastHitStack: ${target.lastHitStack}`);
        }
    }
};



// Alias Game_Action apply
const PK_ELE_IMP_Game_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
    const user = this.subject();
    const item = this.item();
    const elementId = item && item.damage.elementId;
    const result = target.result();
    const noReflect = item.meta.noReflect;
    const ignoreAll = item.meta.ignoreAll;

    // Capture and store target's current element based on the elementRule BEFORE updates
    const targetElement = PK_ElementImpact.getCurrentElement(target);
    this._targetElement = targetElement;

    // Check if reflection should occur
    if (
        PK_ElementImpact.enableReflect &&
        !this._isReflected &&
        !noReflect &&
        !ignoreAll &&
        this.checkReflectCondition(target)
    ) {
        this._processReflect = true; // Set reflection flag
    }

    // Determine if the skill successfully hit the target
    let isHit = result.isHit();

    if (this._processReflect) isHit = true;
    if (isHit && elementId > 0) {
        // Handle element impacts
        PK_ElementImpact.elementImpacts
            .filter(impact => parseInt(impact.elementId) === elementId)
            .forEach(impact => {
                if (Math.random() * 100 < parseInt(impact.chance)) {
                    target.addState(parseInt(impact.stateId));
                }
            });

        // Handle state damage modifiers
        PK_ElementImpact.stateDamageModifiers
            .filter(
                modifier =>
                    parseInt(modifier.elementId) === elementId &&
                    target.isStateAffected(parseInt(modifier.targetStateId))
            )
            .forEach(modifier => {
                const damageMultiplier = parseFloat(modifier.damageMultiplier || 100) / 100;

                // Apply the damage multiplier
                user.elementMulti *= damageMultiplier;

                // Remove the state if specified
                if (JSON.parse(modifier.removeState)) {
                    target.removeState(parseInt(modifier.targetStateId));
                }

                // Add a new state if specified
                if (parseInt(modifier.addStateId) > 0) {
                    target.addState(parseInt(modifier.addStateId));
                }
            });
    }

    PK_ELE_IMP_Game_Action_apply.call(this, target);
};


// Alias Game_Action makeDamageValue
const PK_ELE_IMP_Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical) {
    let value = PK_ELE_IMP_Game_Action_makeDamageValue.call(this, target, critical);
    const user = this.subject();
    const item = this.item();
    const baseValue = Math.round(value);

    // Notetag flags
    const noStacks = item.meta.noStacks;
    const noCycle = item.meta.noCycle;
    const ignoreAll = item.meta.ignoreAll;
    const reverseCycle = item.meta.reverseCycle;

    // Use user element and captured target element from apply
    const userElement = item && item.damage.elementId;
    const targetElement = this._targetElement;

    // Debugging logs for Reverse Cycle
    if (PK_ElementImpact.debugMode) {
        console.log(`Skill: ${item.name}`);
        console.log(`Has Reverse Cycle: ${!!reverseCycle}`);
    }

    // Apply element cycle multiplier
    const elementCycleMultiplier = PK_ElementImpact.getElementMultiplier(userElement, targetElement, !!reverseCycle);

    // Apply State Impact Damage
    value *= user.elementMulti || 1;

    if (!ignoreAll) {
        // Stack calculations
        let damageUsedStack = noStacks ? 0 : user.lastUsedStack / PK_ElementImpact.maxUsedStack;
        let damageHitStack = noStacks ? 0 : target.lastHitStack / PK_ElementImpact.maxHitStack;

        // Apply percentage modifiers
        damageUsedStack *= PK_ElementImpact.useModifier;
        damageHitStack *= PK_ElementImpact.hitModifier;

        // Add stack adjustments to the base value
        value += baseValue * damageUsedStack;
        value += baseValue * damageHitStack;

        // Apply element cycle multiplier
        if (!noCycle) {
            value *= elementCycleMultiplier;
        }
    }

    

    // Round value before returning or reflecting
    value = Math.round(value);
	
	// Handle reflection
    if (this._processReflect) {
        this.reflectSkill(value, target); // Reflect damage back to the user
        value = 0; // Prevent damage to the original target
    }

    // Update elementImpact property for dev use
    user.elementImpact = value - baseValue;

    // Update element tracking for stacks and lastUsed/lastHit elements
    PK_ElementImpact.updateElementTracking(user, target, userElement);
	
	// Update currentElement of skill user
	PK_ElementImpact.getCurrentElement(user);
	PK_ElementImpact.getCurrentElement(target);
	

    // Debug logs for final calculations
    if (PK_ElementImpact.debugMode) {
        console.log("Subject Name:", user.name());
        console.log("Subject Elem:", userElement);
        console.log("Used Stack:", user.lastUsedStack);
        console.log("Target Name:", target.name());
        console.log("Target Elem:", targetElement);
        console.log("Hit Stack:", target.lastHitStack);
        console.log("Base Value:", baseValue);
        console.log("Element Cycle Multiplier:", elementCycleMultiplier);
        console.log("Element Impact:", user.elementImpact);
        console.log("Final Value:", value);
    }

    // Return final value
    return value;
};
