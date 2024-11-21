/**
 * External dependencies
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * WordPress dependencies
 */
import { Modal, Button, ButtonGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */

import SingleTaxonomyControl from './single-taxonomy-control';

export const TaxonomySelect = ( { attributes, setAttributes } ) => {
	const {
		query: {
			postType,
			tax_query: { relation = '', queries = [] } = {},
		} = {},
	} = attributes;

	const [ isOpen, setOpen ] = useState( false );
	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	const availableTaxonomies = useSelect( ( select ) =>
		select( coreStore )
			.getTaxonomies()
			?.filter( ( { types } ) => types.includes( postType ) )
	);

	return (
		<>
			<Button variant="primary" onClick={ openModal } size="large">
				{ __( 'Open Taxonomy query builder', 'advanced-query-loop' ) }
			</Button>
			<br />
			{ isOpen && (
				<Modal
					title={ __(
						'Taxonomy query builder',
						'advanced-query-loop'
					) }
					onRequestClose={ closeModal }
					size="large"
				>
					{ queries.map(
						( {
							id,
							taxonomy,
							terms,
							include_children: includeChildren,
							operator,
						} ) => {
							return (
								<SingleTaxonomyControl
									key={ id }
									id={ id }
									taxonomy={ taxonomy }
									terms={ terms }
									includeChildren={ includeChildren }
									availableTaxonomies={ availableTaxonomies }
									operator={ operator }
									setAttributes={ setAttributes }
									attributes={ attributes }
								/>
							);
						}
					) }
					<ButtonGroup>
						<Button
							variant="primary"
							onClick={ () =>
								setAttributes( {
									query: {
										...attributes.query,
										tax_query: [],
									},
								} )
							}
						>
							Reset
						</Button>
						<Button
							variant="primary"
							onClick={ () => {
								setAttributes( {
									query: {
										...attributes.query,
										tax_query: {
											relation,
											queries: [
												...queries,
												{
													taxonomy: '',
													terms: [],
													include_children: true,
													operator: 'IN',
													id: uuidv4(),
												},
											],
										},
									},
								} );
							} }
						>
							Add new taxonomy query
						</Button>
					</ButtonGroup>
				</Modal>
			) }
		</>
	);
};
